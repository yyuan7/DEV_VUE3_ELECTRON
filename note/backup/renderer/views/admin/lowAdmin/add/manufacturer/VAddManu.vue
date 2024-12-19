<script setup lang="ts">
import AddBusinessData from '@/renderer/components/admin/VAddCompany/AddBusinessData.vue'
import StatePicker from '@/renderer/components/common/VStatePicker.vue'
import { backgroundColor, stateButtonColor } from '@/renderer/utils/stateColorGetter'
import { ref } from 'vue'
import FinalPopup from '@/renderer/components/admin/VAddCompany/VFinalPopup.vue'
import DuplicatePopup from '@/renderer/components/admin/VAddCompany/VManuAddDuplicatePopup.vue'
import { Lists, CompanyMetadata } from '@/renderer/api/admin/type'
import { lists } from '@/renderer/views/billing/sampleData'

const props = defineProps<{
  lists: Lists
}>()

const name = ref('')
const verified = ref(false)
const state = ref<string>('-')
const panel = ref([0])
const scope = ref('single')
const selectedStates = ref<string[]>([])

const checkStateSelection = () => {
  if (scope.value === 'list' && !selectedStates.value.includes(state.value)) {
    return 'Must contain working state.'
  }
}

const errorPopup = ref<string>('none')
const verify = () => {
  if (verified.value) {
    panel.value = [1]
    return
  }
  // if name entry is invalid:
  if (!(name.value && !checkStateSelection())) {
    return
  }
  const statesWithThisManu = ['Maine'] // to be replaced with actual results from database scan
  if (statesWithThisManu.includes(state.value)) {
    errorPopup.value = 'thisState'
    return
  } else if (statesWithThisManu.length > 0 && statesWithThisManu.length < lists.states.length) {
    errorPopup.value = 'otherState'
    return
  }
  // check whether it exists in any states
  if (scope.value === 'single') {
    if (statesWithThisManu.length === lists.states.length) {
      // in all states?
      errorPopup.value = 'national'
    } else if (statesWithThisManu.includes(state.value)) {
      // in active state?
      errorPopup.value = 'thisState'
      return
    } else if (statesWithThisManu.length > 0 && statesWithThisManu.length < lists.states.length) {
      // in other states?
      errorPopup.value = 'otherState'
      return
    }
    return
  } else if (scope.value === 'list') {
    if (statesWithThisManu.includes(state.value)) {
      // in active state?
      errorPopup.value = 'thisState'
      return
    }
    statesWithThisManu.forEach((existingState) => {
      // in a selected state?
      if (selectedStates.value.includes(existingState)) {
        errorPopup.value = 'oneOfStates'
      }
    })
    // check if it exists in a selected state
    // popup can be one of: oneOfStates, otherState, national
  } else if (scope.value === 'national') {
    if (statesWithThisManu.length > 0) {
      // already exists?
      errorPopup.value = 'exists'
      return
    }
  }
  /*
  total popup varieties (with button options):
  thisState (back, view existing) - manu with this name is already selected state
  oneOfStates (back, view existing) - manu with this name already exists in one of the seleced states
  otherState (back, view existing, add new) - manu with this name already exists in another state, not the selected one
  national (back, view existing) - manu with this name exists in every state
  exists (back, view existing) - manu with this name already exists in other states
  */
  verified.value = true
  panel.value = [1]
}

const checkData = () => {
  verified.value = false
  if (name.value) return true
  return 'Required field.'
}

const loadState = (selection: string) => {
  state.value = selection
  console.log(state.value)
}

const finalPopup = ref<string>('closed')
const trySave = (info: CompanyMetadata) => {
  console.log(info.primary.email, ', ', selectedStates.value[0])
  // use info (manufacturer metadata), and selectedStates.value (in the case of cross-state) and scope.value to create manu for database
  if (info) finalPopup.value = 'success'
  else finalPopup.value = 'fail'
}

const cancelInfo = () => {
  console.log('canceling')
  panel.value = [0]
}

const viewExistingRecords = () => {
  // to to manu search page, search by name.value in whatever state there are results in
  console.log('viewing existing manufacturers', name.value)
}
</script>

<template>
  <v-container class="ma-2 container" fluid :style="{ backgroundColor: backgroundColor(state) }">
    <v-container class="align-center justify-center entry-box" min-height="fit-content">
      <StatePicker :states="lists.states" :btn-needed="false" @select-state="loadState" />
      <v-row class="d-flex ma-0">
        <v-card-title class="text-center justify-center ml-auto"
          >Add Manufacturer: {{ name }}</v-card-title
        >
        <div
          class="d-flex state-marker rounded-pill mr-0 ml-auto justify-center"
          :style="{ backgroundColor: stateButtonColor(state) }"
        >
          {{ state.toUpperCase() }}
        </div>
      </v-row>
      <v-expansion-panels v-model="panel" eager>
        <v-expansion-panel>
          <v-expansion-panel-title
            style="font-size: 110%; font-weight: bold; color: white"
            :style="{ backgroundColor: stateButtonColor(state) }"
          >
            Duplicate Manufacturer Pre-Check
          </v-expansion-panel-title>
          <v-expansion-panel-text :style="{ backgroundColor: backgroundColor(state) }">
            <v-row>
              <v-col cols="6">
                <v-card-title>Scope</v-card-title>
                <v-radio-group v-model="scope">
                  <v-radio label="Single-State (state)" value="single"></v-radio>
                  <v-radio value="list"
                    ><template #label>
                      <v-card-text style="font-size: 100%" class="ml-0 pl-0"
                        >Cross-State</v-card-text
                      >
                      <v-select
                        v-model="selectedStates"
                        multiple
                        :items="['Maine', 'New York', 'Connecticut']"
                        variant="outlined"
                        :disabled="scope !== 'list'"
                        return-object
                        :bg-color="'white'"
                        density="compact"
                        width="15vw"
                        class="mt-2"
                        :rules="[(v) => checkStateSelection() || true]"
                      ></v-select> </template
                  ></v-radio>
                  <v-radio label="National (All States)" value="national"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="6">
                <v-form class="text-center">
                  <v-card-title class="d-flex ma-0 pa-0 mt-2 justify-start mr-auto"
                    >Manufacturer Name</v-card-title
                  >
                  <v-row class="justify-start mt-3">
                    <v-text-field
                      ref="input"
                      v-model="name"
                      :bg-color="'white'"
                      class="init-name rounded-lg ml-3"
                      clearable
                      density="compact"
                      placeholder="Enter Manufacturer Name"
                      :rules="[() => checkData() || 'not possible']"
                      variant="outlined"
                    ></v-text-field>
                  </v-row>
                </v-form>
                <v-row class="mt-16">
                  <v-card-text
                    v-if="!verified"
                    class="d-flex align-end justify-end ml-auto"
                    :class="'text-red'"
                    style="font-size: 100%"
                    >Verify name and scope to proceed.</v-card-text
                  >
                  <v-btn
                    class="d-flex justify-end ml-auto"
                    :style="{ backgroundColor: stateButtonColor(state) }"
                    style="color: white"
                    @click="verify()"
                    >Verify</v-btn
                  >
                </v-row>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel :disabled="!verified" readonly>
          <v-expansion-panel-title
            style="font-size: 110%; font-weight: bold; color: white"
            :style="{ backgroundColor: stateButtonColor(state) }"
          >
            Manufacturer Information
          </v-expansion-panel-title>
          <v-expansion-panel-text :style="{ backgroundColor: backgroundColor(state) }">
            <AddBusinessData
              :disabled="!verified"
              :btn-msg="'BACK'"
              :state="state"
              @try-save="trySave"
              @cancel="() => cancelInfo()"
            /> </v-expansion-panel-text
        ></v-expansion-panel>
      </v-expansion-panels>
    </v-container>
    <FinalPopup
      v-model="finalPopup"
      :type="'Manufacturer'"
      @close-tab="
        () => {
          console.log('closing tab')
        }
      "
    />
    <DuplicatePopup
      v-model="errorPopup"
      :manu-name="name"
      :state="state"
      @proceed="
        () => {
          verified = true
          panel = [1]
        }
      "
      @go-view-records="viewExistingRecords()"
    />
  </v-container>
</template>

<style>
@import '@/renderer/styles/lowAdmin.css';
.init-name {
  max-width: 350px;
}
.entry-box {
  width: 70vw;
  height: 85vh;
  background-color: white;
}
.text-box {
  padding: 0%;
  width: 350px;
  height: 7%;
}
.state-marker {
  color: white;
  max-height: 24px;
  padding-left: 1%;
  padding-right: 1%;
  margin-right: 2%;
  max-width: fit-content;
}
</style>
