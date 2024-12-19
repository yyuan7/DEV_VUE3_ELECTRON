<script setup lang="ts">
import { backgroundColor, stateButtonColor } from '@/renderer/utils/stateColorGetter'
import { BillingRule } from '@/renderer/api/billing/type'
import CopyRules from '@/renderer/components/billing/editProcess/VCopyRulesForEdit.vue'
import CreateRules from '@/renderer/components/billing/VCreateRules.vue'
import SimpleBillList from '@/renderer/components/billing/VSimpleBillList.vue'
import { VDateInput } from 'vuetify/labs/VDateInput'
import SuccessPopup from '@/renderer/components/billing/VSuccessPopup.vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { addBillingRule, endDateRules } from '@/renderer/api/billing'
import { useUserStore } from '@/renderer/store/modules/userStore'

const router = useRouter()
const route = useRoute()
const state = ref<string>(route.query.state ? route.query.state.toString() : '-')
const rulesBeingUpdated = route.query.rulesBeingUpdated
  ? JSON.parse(route.query.rulesBeingUpdated.toString()).slice()
  : []

const rulesToDisplay = rulesBeingUpdated.slice()
const addMode = ref<string>('copy')
const warningPopup = ref<boolean>(false)
const successPopup = ref<boolean>(false)
const currentNewRule = ref<BillingRule>()

const dateState = ref<string>('copyDate')
const newStartDate = ref<Date>(new Date())
const newEndDate = ref<Date>()

const addRules = (newRules: BillingRule[]) => {
  currentNewRule.value = newRules[0]
  newStartDate.value = currentNewRule.value.startDate
  newEndDate.value = currentNewRule.value.endDate
  console.log(currentNewRule.value)
  warningPopup.value = true
}

const assignEndDate = async (date: Date) => {
  let result
  try {
    result = await endDateRules({ rules: rulesBeingUpdated, endDate: date })
  } finally {
    console.log(result)
    if (result.code === 200) successPopup.value = true
    else console.warn(result.data.message)
  }
  // command to DB: assign this end date to all billing rules in rulesBeingUpdated!
  // successPopup.value = true // if the push was successful
}

const userStore = useUserStore()
const confirmFinish = async () => {
  const newRules: BillingRule[] = []
  rulesBeingUpdated.forEach((rule) => {
    if (!currentNewRule.value) return
    const newRule = {
      id: Math.random(), // db will generate new unique id
      upcCode: rule.upc.upcCode,
      state: rule.state,
      region: rule.region,
      initiator: currentNewRule.value?.initiator,
      pickupAgent: currentNewRule.value?.pickupAgent,
      distributor: currentNewRule.value?.distributor,
      startDate: newStartDate.value,
      endDate: newEndDate.value,
      dateAdded: new Date(),
      author: userStore.userId
    }
    newRules.push(newRule)
  })
  let result
  try {
    result = await addBillingRule({ newRules: newRules })
  } finally {
    warningPopup.value = false
    if (result.code === 200) successPopup.value = true
    else console.warn(result.data)
  }
  successPopup.value = true // if the push was successful
}
</script>

<template>
  <v-container
    class="ma-2 container rounded-lg"
    fluid
    :style="{ backgroundColor: backgroundColor(state) }"
  >
    <v-row class="d-flex pb-0 mb-0 ml-0" justify="space-between">
      <v-card-title class="page-header"> Edit Billing Rules </v-card-title>
      <v-col class="ma-0" cols="auto">
        <div
          class="d-flex state-marker rounded-pill mr-3 ml-auto justify-center px-3"
          :style="{ backgroundColor: stateButtonColor(state) }"
        >
          {{ state.toUpperCase() }}
        </div>
      </v-col>
    </v-row>
    <hr class="hr-style mt-0 mb-6" />
    <v-card class="d-flex">
      <v-col>
        <v-card-title>Edit the following Rules:</v-card-title>
        <v-row class="justify-center mx-auto ma-0 pa-0" style="max-width: 70vw">
          <SimpleBillList
            v-model="rulesToDisplay"
            :features="['heightLimit', 'showUPC']"
            :state="state"
          />
        </v-row>
        <hr class="hr-style mt-3 mb-4" style="opacity: 50%" />
        <v-radio-group
          v-model="addMode"
          inline
          class="d-flex my-0 pb-2 justify-center mx-auto"
          hide-details
        >
          <v-radio
            :color="stateButtonColor(state)"
            label="Copy Existing Billing Rules"
            value="copy"
            class="mr-16 pr-16"
          ></v-radio>
          <v-radio
            :color="stateButtonColor(state)"
            class="ml-16 pl-16"
            label="Create New Billing Pattern"
            value="create"
          ></v-radio>
        </v-radio-group>
        <CopyRules v-if="addMode === 'copy'" :state="state" @attempt-finish="addRules" />
        <CreateRules
          v-if="addMode === 'create'"
          :state="state"
          :edit-mode="rulesBeingUpdated[0]"
          @attempt-finish="addRules"
          @assign-date-only="assignEndDate"
        />
      </v-col>
    </v-card>
    <v-dialog v-model="warningPopup" max-width="550" overflow="hidden">
      <v-card class="text-center">
        <v-toolbar class="missing-region-alert">
          <v-icon class="ml-4" size="large">mdi-alert-circle-outline</v-icon>
          <v-card-title>Confirm</v-card-title>
        </v-toolbar>
        <v-card-text class="text-center mb-0 pb-0"
          >The billing rule you have selected will replace the following data:</v-card-text
        >
        <v-card-text class="text-center mt-0 pt-0 pb-1"
          >Initiator, Pickup Agent, Distributor</v-card-text
        >
        <v-card-text class="text-center ma-0 pa-0 pb-1"
          >Would you like to copy the start and end dates as well?</v-card-text
        >
        <v-row class="ml-8">
          <v-col cols="4">
            <v-radio-group v-model="dateState">
              <v-radio
                value="copyDate"
                label="Copy Dates"
                class="ma-0 pa-0"
                :color="stateButtonColor(state)"
              ></v-radio>
              <v-radio
                value="newDate"
                label="Choose Dates"
                class="ma-0 pa-0"
                :color="stateButtonColor(state)"
              >
              </v-radio>
            </v-radio-group>
          </v-col>
          <v-col>
            <v-row class="mt-4" style="width: 320px; transform: translateX(-10px)">
              <v-date-input
                v-model="newStartDate"
                :disabled="dateState === 'copyDate'"
                bg-color="white"
                class="date-box mt-6 mr-0 pr-0"
                prepend-inner-icon="$calendar"
                prepend-icon=""
                variant="outlined"
                density="compact"
              />
              <v-card-text class="ma-0 pa-0 mt-9" style="max-width: 16px">-</v-card-text>
              <v-date-input
                v-model="newEndDate"
                :disabled="dateState === 'copyDate'"
                bg-color="white"
                class="date-box mt-6 ml-0 pl-0"
                prepend-inner-icon="$calendar"
                prepend-icon=""
                variant="outlined"
                density="compact"
              />
            </v-row>
          </v-col>
        </v-row>
        <template #actions>
          <v-row class="d-flex justify-center">
            <v-btn
              class="cancel-button mr-4"
              style="height: 40px; width: 6vw"
              text="Cancel"
              variant="outlined"
              @click="warningPopup = false"
            ></v-btn>
            <v-btn
              class="mb-2"
              color="white"
              style="height: 40px; width: 9vw"
              :style="{ backgroundColor: stateButtonColor(state) }"
              text="update rules"
              @click="confirmFinish()"
            ></v-btn>
          </v-row>
        </template>
      </v-card>
    </v-dialog>
    <SuccessPopup v-model="successPopup" :state="state" :type="'edit'" />
  </v-container>
</template>

<style scoped>
@import '@/renderer/styles/lowAdmin.css';
@import '@/renderer/styles/billing.css';
.missing-region-alert {
  background-color: #fff3cd;
}
.date-box {
  min-width: 100px;
}
</style>
