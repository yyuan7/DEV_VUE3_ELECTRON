<script setup lang="ts">
import { backgroundColor, stateButtonColor } from '@/renderer/utils/stateColorGetter'
import { BillingRule } from '@/renderer/api/billing/type'
import CopyRules from '@/renderer/components/billing/addProcess/VCopyRules.vue'
import CreateRules from '@/renderer/components/billing/VCreateRules.vue'
import UPCTable from '@/renderer/components/billing/VUpcTable.vue'
import SuccessPopup from '@/renderer/components/billing/VSuccessPopup.vue'
import { lists } from '../sampleData'
import { UpcData } from '@/renderer/api/upc/type'
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/renderer/store/modules/userStore'
import { useRoute, useRouter } from 'vue-router'
import { getUpcInfo } from '@/renderer/api/upc'
import StatePicker from '@/renderer/components/common/VStatePicker.vue'
import { addBillingRule } from '@/renderer/api/billing'

const router = useRouter()
const route = useRoute()
const state = ref<string>(route.query.state ? route.query.state.toString() : '')
const upcCodesToImplement = route.query.upcs ? JSON.parse(route.query.upcs.toString()).upcs : []
const upcsGettingRules = ref<UpcData[]>([])
const upcListReady = ref<number>(0)
const convertCodesToRules = () => {
  try {
    upcCodesToImplement.forEach(async (upc) => {
      const result = await getUpcInfo(upc)
      upcsGettingRules.value.push(result.data.list[0])
    })
  } finally {
    upcListReady.value += 1
  }
}
onMounted(() => {
  convertCodesToRules()
})

const addMode = ref<string>('copy')
const warningPopup = ref<boolean>(false)
const currentNewRuleList = ref<BillingRule[]>([])
const missingRegions = ref<string[]>([])
const successPopup = ref<boolean>(false)

const confirmOverridePopup = ref<boolean>(false)

const addRules = (newRules: BillingRule[]) => {
  missingRegions.value = []
  const relevantRegions = lists.regionsByState.find((item) => item.state === state.value)
  if (!relevantRegions) {
    console.error("very bad!! we're in a state with no regions!")
    return
  }
  let missing = false
  for (const region of relevantRegions.regions) {
    const ruleInRegion = newRules.find((rule) => rule.region === region)
    if (!ruleInRegion) {
      missing = true
      missingRegions.value.push(region)
    }
  }
  currentNewRuleList.value = newRules
  if (!missing) {
    confirmOverridePopup.value = true
  } else {
    warningPopup.value = missing
  }
}

const userStore = useUserStore()
const confirmFinish = async () => {
  const newRules: BillingRule[] = []
  upcsGettingRules.value.forEach((upcGettingRules) => {
    currentNewRuleList.value.forEach((rule) => {
      const newRule = {
        id: Math.random(), // db will generate new unique id
        upcCode: upcGettingRules.upcCode,
        state: rule.state,
        region: rule.region,
        initiator: rule.initiator,
        pickupAgent: rule.pickupAgent,
        distributor: rule.distributor,
        startDate: rule.startDate,
        endDate: rule.endDate,
        dateAdded: new Date(),
        author: userStore.userId
      }
      newRules.push(newRule)
    })
  })
  warningPopup.value = false
  let result
  try {
    result = await addBillingRule({ newRules: newRules })
  } finally {
    console.log(result.code)
    if (result.code === 200) successPopup.value = true
    else console.warn(result)
  }
}
</script>

<template>
  <v-container
    class="ma-2 container rounded-lg"
    fluid
    :style="{ backgroundColor: backgroundColor(state) }"
  >
    <v-row class="d-flex pb-0 mb-0 ml-0" justify="space-between">
      <v-card-title class="page-header"> Add Billing Rules </v-card-title>
      <v-col class="ma-0" cols="auto">
        <div
          class="d-flex state-marker rounded-pill mr-3 ml-auto justify-center px-3"
          :style="{ backgroundColor: stateButtonColor(state) }"
        >
          {{ state.toUpperCase() }}
        </div>
        <StatePicker
          :btnNeeded="false"
          :initial="state"
          @select-state="
            (newstate) => {
              state = newstate
              convertCodesToRules()
            }
          "
        />
      </v-col>
    </v-row>
    <hr class="hr-style mt-0 mb-6" />
    <v-card class="d-flex">
      <v-col>
        <v-card-title
          >Add Billing Rules for the following
          {{
            upcsGettingRules.length > 1 ? upcsGettingRules.length + ' UPCs' : 'UPC'
          }}:</v-card-title
        >
        <v-row class="justify-center mx-auto mt-1 mb-4">
          <UPCTable
            v-if="upcsGettingRules.length > 0"
            :key="upcListReady"
            :UPCsToDisplay="upcsGettingRules"
            :state="state"
            :name="true"
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
            label="Create New Billing Rules"
            value="create"
          ></v-radio>
        </v-radio-group>
        <CopyRules v-if="addMode === 'copy'" :state="state" @attempt-finish="addRules" />
        <CreateRules v-if="addMode === 'create'" :state="state" @attempt-finish="addRules" />
      </v-col>
    </v-card>
    <v-dialog v-model="warningPopup" max-width="500" overflow="hidden">
      <v-card class="text-center">
        <v-toolbar class="missing-region-alert">
          <v-icon class="ml-4" size="large">mdi-alert-circle-outline</v-icon>
          <v-card-title>Missing Regions</v-card-title>
        </v-toolbar>
        <v-card-text class="text-center"
          >WARNING: These rules do not cover all regions in the selected state. Would you like to
          proceed anyway?</v-card-text
        >
        <v-card-text class="ma-0 pa-0 mb-3">The following regions are missing:</v-card-text>
        <v-card-text
          v-for="(region, index) of missingRegions"
          :key="index"
          class="ma-0 pa-0 mb-2"
          >{{ region }}</v-card-text
        >
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
              style="height: 40px; width: 10vw"
              :style="{ backgroundColor: stateButtonColor(state) }"
              text="Proceed Anyway"
              @click="() => confirmFinish()"
            ></v-btn>
          </v-row>
        </template>
      </v-card>
    </v-dialog>
    <SuccessPopup v-model="successPopup" :state="state" :type="'add'" />
    <v-dialog v-model="confirmOverridePopup" max-width="350" overflow="hidden">
      <v-card class="text-center">
        <v-toolbar class="missing-region-alert">
          <v-icon class="ml-4" size="large">mdi-alert-circle-outline</v-icon>
          <v-card-title>Warning</v-card-title>
        </v-toolbar>
        <v-card-text class="text-center mb-2 pb-0"
          >These rules will override any active rules in the selected state and region.
        </v-card-text>
        <template #actions>
          <v-row class="d-flex justify-center">
            <v-btn
              class="cancel-button mr-4 mb-2"
              style="height: 35px; width: 6vw"
              text="Back"
              variant="outlined"
              @click="confirmOverridePopup = false"
            ></v-btn>
            <v-btn
              class="cancel-button mr-4 mb-2"
              style="height: 35px; width: 6vw"
              color="white"
              :style="{ backgroundColor: stateButtonColor(state) }"
              text="Confirm"
              variant="outlined"
              @click="
                () => {
                  confirmFinish()
                  confirmOverridePopup = false
                }
              "
            ></v-btn>
          </v-row>
        </template>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
@import '@/renderer/styles/lowAdmin.css';
@import '@/renderer/styles/billing.css';
.missing-region-alert {
  background-color: #fff3cd;
}
</style>
