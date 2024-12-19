<script setup lang="ts">
import UpdateFee from '@/renderer/components/admin/VUpdateFee/UpdateFee.vue'
import UpdateHistory from '@/renderer/components/admin/VUpdateFee/VUpdateHistory.vue'
import PendingUpdates from '@/renderer/components/admin/VUpdateFee/VPendingUpdates.vue'
import { backgroundColor, stateButtonColor } from '@/renderer/utils/stateColorGetter'
import StatePicker from '@/renderer/components/common/VStatePicker.vue'
import {
  Company,
  Lists,
  Modification,
  NegotiatedRate,
  PendingRateUpdate
} from '@/renderer/api/admin/type'
import { ref, computed } from 'vue'
import { update } from 'lodash-es'

const props = defineProps<{
  updateHistory: Modification[]
  rates: NegotiatedRate[]
  updates: PendingRateUpdate[]
  lists: Lists
}>()

/*

IMPORTANT: Would all negotiated rates have an end date right off the bat, or are they constant until renegotiated? does this need to be displayed to the user,
since it can differ by material (e.g. cosco aluminum ends in march, costco plastic ends in april)?

NOTE: modification history currently buggy due to sample data setup. lots of arrays were reused, which worked finewhen there was minimal filtering, but
data isn't read from the same data correctly anymore with the distributor distinction. will be possible to debug once data is correctly defined with the necessary
references in place.

*/

const activeState = ref('')
const stateRates = ref(props.rates.filter((item) => item.state === activeState.value))
const stateUpdates = ref(props.updates.filter((item) => item.state === activeState.value))
const selectedDist = ref<string>('')

const neededNegRates = () => {
  const relevantRates = stateRates.value.filter((item) => item.distributor === selectedDist.value)
  return relevantRates // also check if the distributor needs negotiated rates at all!
}

const getRate = (distributor: string, material: string) => {
  const rate = stateRates.value.find(
    (rate) => rate.distributor === distributor && rate.material === material
  )
  return rate?.rate || '-'
}

const updateMode = ref(false)
const processUpdate = (item: Object) => {
  // to be connected to database
  if (item) {
    console.log(item)
  }
  updateMode.value = false
}

const stateSelector = ref(true)

const loadState = (state: string) => {
  activeState.value = state
  stateSelector.value = false
  updateMode.value = false
  stateRates.value = props.rates.filter((item) => item.state === state)
  stateUpdates.value = props.updates.filter((item) => item.state === state)
}

const filteredUpdates = computed(() => {
  return stateUpdates.value.filter(
    (item) => item.status === 'pending' && item.distributor === selectedDist.value
  )
})

const updateToRemove = ref<PendingRateUpdate | null>(null)
const confirmationPopup = ref(false)

const deleteUpdate = (update: string) => {
  updateToRemove.value = stateUpdates.value.find((item) => item.id === update) || null
  confirmationPopup.value = true
}

const confirmDelete = () => {
  confirmationPopup.value = false
  if (updateToRemove.value) {
    // perform the removal of the update with given id
    console.log('removing', updateToRemove.value.id)
  }
}

const getDistributors = () => {
  return props.lists.distributors
}
</script>

<template>
  <v-container
    class="ma-2 container"
    fluid
    :style="{ backgroundColor: backgroundColor(activeState) }"
  >
    <v-row class="d-flex pb-0 mb-0 ml-0" justify="space-between" align="center">
      <v-card-title class="page-header"> Manage Negotiated Pickup/Processing Rates </v-card-title>
      <v-col class="ma-0 pa-0 mb-2" cols="auto">
        <StatePicker :btn-needed="true" @select-state="loadState" />
      </v-col>
    </v-row>
    <hr class="hr-style mt-0 mb-6" />
    <v-row class="ma-0 pa-0" style="width: fit-content">
      <v-card-text class="fee-update-title ma-0 pa-0 ml-4 mr-8 mt-2">Distributor:</v-card-text>
      <v-autocomplete
        v-model="selectedDist"
        class="ma-0 pa-0 justify-start"
        :items="getDistributors()"
        variant="outlined"
        :bg-color="'white'"
        style="min-width: 350px"
      />
      <v-card-text v-if="!selectedDist">Select a distributor to view negotiated rates.</v-card-text>
      <v-card-text v-if="selectedDist"
        ><!-- check if distributor wants to use negotiated rates - add to v-if -->Distributor has
        opted to use state-wide rates.</v-card-text
      >
    </v-row>
    <v-row class="mt-0 pt-0">
      <v-col cols="8">
        <v-card class="fee-card pa-4 mb-8 mt-0">
          <v-row class="d-flex mb-1">
            <v-card-title class="fee-update-title">Current Negotiated Rates (¢)</v-card-title>
            <v-btn
              class="ml-auto mt-2 mr-4"
              :style="{ backgroundColor: stateButtonColor(activeState) }"
              style="color: white"
              :disabled="updateMode"
              @click="
                () => {
                  updateMode = true
                }
              "
              >Update</v-btn
            >
          </v-row>
          <v-data-table hide-default-footer class="fee-table">
            <tr>
              <th class="fee-header">Distributor</th>
              <th v-for="material in lists.materials" :key="material" class="fee-header">
                {{ material }}
              </th>
            </tr>
            <tr v-if="neededNegRates().length > 0">
              <td class="fee-data py-4">{{ selectedDist }}</td>
              <td v-for="material in lists.materials" :key="material" class="fee-data">
                {{ getRate(selectedDist, material) }}
              </td>
            </tr>
          </v-data-table>
          <v-card-text
            v-if="neededNegRates().length === 0"
            :key="selectedDist"
            class="d-flex justify-center align-center w-100"
          >
            No active negotiated rates.
          </v-card-text>
        </v-card>
        <v-card class="fee-card pa-4">
          <v-row class="pa-4 pb-0">
            <v-card-title class="ma-0 pa-0 fee-update-title">Pending Updates</v-card-title>
          </v-row>
          <v-row class="d-flex pa-4 rounded-sm">
            <PendingUpdates
              :updates-to-render="filteredUpdates"
              :col1="'Distributor'"
              :col2="'Material'"
              @deletion="deleteUpdate"
            />
            <v-card-text
              v-if="filteredUpdates.length === 0"
              class="d-flex justify-center align-center w-100"
            >
              No currently pending updates.
            </v-card-text>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="fee-card mt-0">
          <UpdateHistory
            v-if="!updateMode"
            :update-history="updateHistory"
            :updates="updates.filter((update) => update.state === activeState)"
            :metric="'material'"
            :distributor="selectedDist"
          />
          <UpdateFee
            v-if="updateMode"
            :main-name="'Distributor'"
            :mains="lists.distributors"
            :type-name="'Material'"
            :types="lists.materials"
            :state="activeState"
            @end-updating="processUpdate"
          />
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="confirmationPopup" max-width="500" overflow="hidden">
      <v-card
        width="25vw"
        prepend-icon="mdi-alert-circle-outline"
        text="Are you sure you would like to delete the following update?"
        title="Confirm Delete"
      >
        <v-card-text class="mt-0 pt-0">
          {{ updateToRemove?.state }} -- {{ updateToRemove?.distributor }} --
          {{ updateToRemove?.category }} -- {{ updateToRemove?.amount }}¢ --
          {{ updateToRemove?.date }}
        </v-card-text>
        <template #actions>
          <v-row class="d-flex justify-center">
            <v-btn
              class="me-2 cancel-button"
              style="height: 40px; width: 10vw"
              text="Cancel"
              variant="outlined"
              @click="confirmationPopup = false"
            ></v-btn>
            <v-btn
              class="mr-2 mb-2"
              color="white"
              style="background-color: #0a762b; height: 40px; width: 10vw"
              text="Delete"
              @click="confirmDelete"
            ></v-btn>
          </v-row>
        </template>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
@import '@/renderer/styles/lowAdmin.css';
</style>
