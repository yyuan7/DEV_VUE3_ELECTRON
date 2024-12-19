<script setup lang="ts">
import { BillingRule } from '@/renderer/api/billing/type'
import { backgroundColor, stateButtonColor } from '@/renderer/utils/stateColorGetter'
import SimpleBillList from '@/renderer/components/billing/VSimpleBillList.vue'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { VForm } from 'vuetify/components'
import { lists } from '@/renderer/views/billing/sampleData'
import { ref, reactive, watch } from 'vue'
// AUTO-FETCH
import FetchCompany from '../common/autocomplete/fetchCompany.vue'
import { useUserStore } from '@/renderer/store/modules/userStore'

const props = defineProps<{
  state: string // currently selected state
  editMode?: BillingRule // if present, used to pre-fill dropdown options with data from rules being edited
}>()

const getRegions = () => {
  return lists.regionsByState.find((regionlist) => regionlist.state === props.state)?.regions
}

//  creating rules //
const billingRuleMaker = ref<VForm>()
const formData = reactive({
  initiator: null,
  distributor: null,
  regions: [],
  pickupAgent: null
})
const startDateEntry = ref<Date>()
const endDateEntry = ref<Date>()

const endOnly = ref<boolean>(false)

const ifEditMode = () => {
  if (props.editMode) Object.assign(formData, props.editMode)
}
ifEditMode()

// form input validation //
const reqRule = [(v: any) => !!v || 'Required field.']
const regionRule = [() => formData.regions.length > 0 || 'At least one region is required.']

const checkDates = () => {
  if (endOnly.value) return true
  if (!endDateEntry.value) return true
  if (startDateEntry.value) return startDateEntry.value < endDateEntry.value
}
const dateRule = [() => checkDates() || 'Invalid date range.']

//  adding rules to worklist //
const rulesBeingAdded = ref<typeof SimpleBillList | null>(null)
const worklist = ref<BillingRule[]>([])

const addToWorklist = (newrule: BillingRule) => {
  const regionID = worklist.value.findIndex((item) => item.region === newrule.region)
  if (regionID !== -1) {
    worklist.value.splice(regionID, 1)
  }
  worklist.value.push(newrule)
}

const userStore = useUserStore()
const getItem = (region: string) => {
  return {
    id: Math.random(),
    upcCode: '-1',
    state: props.state,
    region: region,
    initiator: formData.initiator ? formData.initiator : '',
    distributor: formData.distributor ? formData.distributor : '',
    pickupAgent: formData.pickupAgent ? formData.pickupAgent : '',
    startDate: startDateEntry.value ? startDateEntry.value : new Date(),
    endDate: endDateEntry.value ? endDateEntry.value : undefined,
    dateAdded: new Date(),
    author: userStore.userId
  }
}

const emit = defineEmits(['attemptFinish', 'assignDateOnly'])
const finishMakingRules = () => {
  emit('attemptFinish', worklist.value)
}

const clearAddedRules = () => {
  worklist.value = []
}

const addRules = async () => {
  const check = await billingRuleMaker.value?.validate()
  if (!endOnly.value) {
    if (check?.errors.length === 0) {
      if (!props.editMode) {
        formData.regions.forEach((regionVal) => {
          addToWorklist(getItem(regionVal))
        })
      } else {
        addToWorklist(getItem(''))
      }
    }
  }
}
const clearFields = () => {
  formData.initiator = null
  formData.distributor = null
  formData.regions = []
  formData.pickupAgent = null
  startDateEntry.value = new Date()
  endDateEntry.value = undefined
}

const testStart = ref<Date>()
watch(testStart, (newValue) => {
  console.log(newValue)
})
</script>

<template>
  <v-col>
    <v-row> </v-row>
    <hr class="hr-style mt-6 mb-6" style="opacity: 50%" />
    <v-col class="ma-0 pa-0">
      <v-row class="ma-0 pa-0">
        <v-col class="ma-0 pa-0" cols="5">
          <v-row class="ma-0 pa-0">
            <v-card-title class="mt-0 pt-0 ml-6">Create New Rules:</v-card-title>
            <v-btn
              class="justify-end ml-auto mr-10"
              style="height: 30px"
              variant="outlined"
              @click="clearFields()"
              >clear fields</v-btn
            >
          </v-row>
          <v-form ref="billingRuleMaker">
            <v-card class="my-0 pa-0 justify-center mx-auto" width="35vw">
              <v-list :style="{ backgroundColor: backgroundColor(state) }">
                <v-list-item>
                  <v-row class="ma-0 pa-0">
                    <v-card-text class="field-msg-text">Initiator:</v-card-text>
                    <FetchCompany
                      v-model="formData.initiator"
                      :placeholder="'Select Initiator'"
                      :rules="reqRule"
                      :compact="true"
                      :class="'text-entry'"
                      :disable="endOnly"
                    />
                  </v-row>
                </v-list-item>
                <v-list-item>
                  <v-row class="ma-0 pa-0">
                    <v-card-text class="field-msg-text">Distributor:</v-card-text>
                    <FetchCompany
                      v-model="formData.distributor"
                      :placeholder="'Select Distributor'"
                      :rules="reqRule"
                      :compact="true"
                      :class="'text-entry'"
                      :disable="endOnly"
                    />
                  </v-row>
                </v-list-item>
                <v-list-item>
                  <v-row class="ma-0 pa-0">
                    <v-card-text class="field-msg-text">Regions:</v-card-text>
                    <v-autocomplete
                      :disabled="editMode ? true : false"
                      bg-color="white"
                      :rules="editMode ? [] : regionRule"
                      multiple
                      variant="outlined"
                      density="compact"
                      v-model="formData.regions"
                      :items="getRegions()"
                      class="text-entry"
                    />
                  </v-row>
                </v-list-item>
                <v-list-item>
                  <v-row class="ma-0 pa-0">
                    <v-card-text class="field-msg-text">Pickup Agent:</v-card-text>
                    <FetchCompany
                      v-model="formData.pickupAgent"
                      :placeholder="'Select Pickup Agent'"
                      :rules="reqRule"
                      :compact="true"
                      :class="'text-entry'"
                      :disable="endOnly"
                    />
                  </v-row>
                </v-list-item>
                <v-list-item>
                  <v-row class="ma-0 pa-0">
                    <v-card-text class="field-msg-text">Start Date:</v-card-text>
                    <v-date-input
                      :disabled="endOnly"
                      bg-color="white"
                      class="date-box"
                      prepend-inner-icon="$calendar"
                      prepend-icon=""
                      variant="outlined"
                      density="compact"
                      v-model="startDateEntry"
                    />
                  </v-row>
                </v-list-item>
                <v-list-item class="my-0 py-0">
                  <v-row class="ma-0 pa-0">
                    <v-card-text class="field-msg-text">End Date:</v-card-text>
                    <v-date-input
                      bg-color="white"
                      @click:clear="endDateEntry = undefined"
                      clearable
                      class="date-box"
                      :rules="dateRule"
                      prepend-inner-icon="$calendar"
                      prepend-icon=""
                      variant="outlined"
                      density="compact"
                      v-model="endDateEntry"
                    />
                  </v-row>
                </v-list-item>
                <v-list-item v-if="editMode"
                  ><v-row class="justify-start mr-auto">
                    <v-btn
                      density="compact"
                      class="ml-3"
                      style="background-color: transparent; color: black; height: 8vh !important"
                      flat
                      @click="
                        () => {
                          endOnly = !endOnly
                        }
                      "
                    >
                      <v-icon
                        :icon="endOnly ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'"
                        size="x-large"
                        class="ma-0 pa-0 mr-4"
                      /> </v-btn
                    ><v-card-text class="field-msg-text mt-6" style="transform: translateX(-20px)"
                      >End Date Only</v-card-text
                    >
                    <v-btn
                      v-if="endOnly && endDateEntry"
                      class="justify-end ml-auto mt-4"
                      @click="emit('assignDateOnly', endDateEntry)"
                      :style="{ backgroundColor: stateButtonColor(state) }"
                      style="color: white"
                      >Assign End Dates</v-btn
                    ></v-row
                  ></v-list-item
                >
              </v-list>
            </v-card>
          </v-form>
        </v-col>
        <v-col class="ma-0 pa-0" cols="1">
          <v-row class="position-relative justify-center mx-auto">
            <v-divider
              class="mt-16"
              vertical
              color="'black'"
              :thickness="3"
              style="min-height: 40vh"
            />
            <v-col
              class="position-absolute d-flex flex-column align-center justify-center mt-16 pt-16"
            >
              <v-btn
                class="d-flex justify-center mx-auto my-1 mx-0"
                prepend-icon="mdi-plus"
                @click="addRules()"
                :style="{ backgroundColor: stateButtonColor(state) }"
                style="color: white"
                :disabled="endOnly"
                >add</v-btn
              >
              <v-btn
                class="d-flex justify-center mx-auto my-1"
                @click="clearAddedRules()"
                variant="outlined"
                style="background-color: white"
                :disabled="endOnly"
                >clear</v-btn
              >
            </v-col>
          </v-row>
        </v-col>
        <v-col class="ma-0 pa-0" cols="6">
          <v-card-title class="mt-0 pt-0">{{
            editMode ? 'New Rule:' : 'Rules Added:'
          }}</v-card-title>
          <SimpleBillList
            ref="rulesBeingAdded"
            :state="state"
            v-model="worklist"
            :features="['deletable']"
          />
          <v-btn
            v-if="!endOnly"
            :disabled="worklist.length === 0"
            class="d-flex justify-end ml-auto mt-6"
            :style="{ backgroundColor: stateButtonColor(state) }"
            style="color: white"
            @click="finishMakingRules()"
            >Finish</v-btn
          >
        </v-col>
      </v-row>
    </v-col>
  </v-col>
</template>

<style scoped>
@import '@/renderer/styles/lowAdmin.css';
@import '@/renderer/styles/billing.css';
.position-relative {
  position: relative;
}
.text-entry {
  max-width: 20vw;
  min-width: 20vw;
}
.date-box {
  max-width: 15vw;
  min-width: 15vw;
}
.field-msg-text {
  margin: 0%;
  padding: 0%;
  font-size: 110%;
}
</style>
