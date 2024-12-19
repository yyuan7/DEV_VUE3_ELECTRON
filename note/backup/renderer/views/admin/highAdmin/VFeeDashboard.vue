<script setup lang="ts">
import UpdateFee from '@/renderer/components/admin/VUpdateFee/UpdateFee.vue'
import UpdateHistory from '@/renderer/components/admin/VUpdateFee/VUpdateHistory.vue'
import PendingUpdates from '@/renderer/components/admin/VUpdateFee/VPendingUpdates.vue'
import CurrentRates from '@/renderer/components/admin/VUpdateFee/VCurrentRates.vue'
import { Modification, Lists, StateCatRate, PendingRateUpdate } from '@/renderer/api/admin/type'
import { stateButtonColor } from '@/renderer/utils/stateColorGetter'
import { ref } from 'vue'

const props = defineProps<{
  updateHistory: Modification[]
  rates: StateCatRate[]
  updates: PendingRateUpdate[]
  lists: Lists
  feeType: String
}>()

const getRate = (state: string, type: string) => {
  if (props.feeType === 'Deposit' || props.feeType === 'Pickup/Processing') {
    const rate = props.rates.find((rate) => rate.state === state && rate.category === type)
    return rate?.rate || -1
  } else if (props.feeType === 'Handling') {
    const rate = props.rates.find((rate) => rate.state === state)
    return rate?.rate || -1
  }
}

const confirmationPopup = ref(false)
const updateToRemove = ref<PendingRateUpdate | null>(null)

const getUpdateById = (id: string) => {
  for (const update of props.updates) {
    if (update.id === id) return update
  }
}

const deleteUpdate = (id: string) => {
  updateToRemove.value = getUpdateById(id) || null
  console.log(updateToRemove.value)
  confirmationPopup.value = true
}

const confirmDelete = () => {
  confirmationPopup.value = false
  if (updateToRemove.value) {
    // perform the removal of the update with given id
    console.log(updateToRemove.value)
  }
}

const updateMode = ref(false)

const processUpdate = (item: Object) => {
  // to be connected to database
  if (item) {
    console.log(item)
  }
  updateMode.value = false
}

const goToRates = () => {
  // cue route to transfer to VPickupRates page, perhaps open in a new tab
  console.log('viewing negotiated rates')
}
</script>

<template>
  <v-container class="ma-2 container" fluid style="background-color: rgba(175, 240, 150, 0.216)">
    <v-card-title class="pb-0 mb-0 page-header"> Manage {{ feeType }} Fee </v-card-title>
    <hr class="hr-style mt-0 mb-6" />
    <v-row>
      <v-col cols="8">
        <v-card class="fee-card pa-4 mb-8">
          <v-row class="d-flex mb-1">
            <v-card-title class="fee-update-title">Current Rates (¢)</v-card-title>
            <v-btn
              class="ml-auto mt-2 mr-4"
              :style="{ backgroundColor: stateButtonColor('Maine') }"
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
          <CurrentRates
            :header-type="'State'"
            :columns="feeType === 'Pickup/Processing' ? lists.materials : lists.types"
            :rows="lists.states"
            :get-rate="getRate"
          />
          <v-row class="d-flex mt-2 mr-0 mb-0">
            <v-btn
              v-if="feeType === 'Pickup/Processing'"
              class="justify-end ml-auto"
              variant="outlined"
              style="background-color: white; border-color: #898ea1"
              @click="goToRates()"
              >View Negotiated Rates</v-btn
            >
          </v-row>
        </v-card>
        <v-card class="fee-card pa-4">
          <v-card-title class="ma-0 pa-0 fee-update-title">Pending Updates</v-card-title>
          <PendingUpdates
            :updates-to-render="updates.filter((item) => item.status === 'pending')"
            :col1="'State'"
            :col2="feeType === 'Pickup/Processing' ? 'Material' : 'Type'"
            @deletion="deleteUpdate"
          />
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="fee-card">
          <UpdateHistory
            v-if="!updateMode"
            :update-history="updateHistory"
            :updates="updates"
            :metric="'none'"
          />
          <UpdateFee
            v-if="updateMode"
            :main-name="'State'"
            :mains="lists.states"
            :type-name="feeType === 'Pickup/Processing' ? 'Material' : 'Type'"
            :types="feeType === 'Pickup/Processing' ? lists.materials : lists.types"
            :state="'Maine'"
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
          {{ updateToRemove?.state }} -- {{ updateToRemove?.category }} --
          {{ updateToRemove?.amount }}¢ -- {{ updateToRemove?.date }}
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
              @click="confirmDelete()"
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
