<script setup lang="ts">
import { BillingRule } from '@/renderer/api/billing/type'
import { stateButtonColor } from '@/renderer/utils/stateColorGetter'
import SimpleBillList from '@/renderer/components/billing/VSimpleBillList.vue'
import UPCList from '../VUPCList.vue'
import UPCTable from '../VUpcTable.vue'
import { ref } from 'vue'
import { lists, billingRules as rules, upcs } from '@/renderer/views/billing/sampleData'
import { UpcData } from '@/renderer/api/upc/type'
import { getBillingRuleList } from '@/renderer/api/billing'
import { getUpcList } from '@/renderer/api/upc'
import { defaultPaginationData } from '@/renderer/constants/pagination'
import FetchCompany from '../../common/autocomplete/fetchCompany.vue'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'

const manus = lists.manufacturers
const regions = lists.regionsByState

const props = defineProps<{
  state: string // currently selected state
}>()

//  search for upc to copy //
const searchUPC = ref<number | null>(null)
const searchManu = ref<string | null>(null)
const upcSearchResults = ref<UpcData[]>([])
const researched = ref<number>(0)
const resultsTable = ref<typeof UPCList | null>(null)
const upcToCopy = ref<UpcData | null>(null)

const find = async () => {
  const formData = {
    currentPage: defaultPaginationData.currentPage,
    size: defaultPaginationData.pageSize,
    totalPages: defaultPaginationData.totalPages,
    upcCode: searchUPC.value ? searchUPC.value.toString() : undefined,
    manufacturer: searchManu.value ? searchManu.value : undefined
  }
  try {
    const response = await getUpcList(formData)
    upcSearchResults.value = response.data.list
  } catch (error) {
    snackbarStore.showErrorMessage(`Search Error: ${error}`)
  } finally {
    upcToCopy.value = null
    researched.value += 1
  }
}

const enableProceed = () => {
  return resultsTable.value?.selected[0]
}

const worklist = ref<BillingRule[]>([])
const foundUPCToCopy = ref<number>(0)
const snackbarStore = useSnackbarStore()
const assignToCopy = async (reassign: boolean) => {
  if (!reassign) upcToCopy.value = enableProceed()

  if (!upcToCopy.value) return
  const formData = {
    currentPage: defaultPaginationData.currentPage,
    size: defaultPaginationData.pageSize,
    totalPages: defaultPaginationData.totalPages,
    upcs: [upcToCopy.value.upcCode],
    state: props.state
  }
  try {
    const response = await getBillingRuleList(formData)

    worklist.value = response.data.list
  } catch (error) {
    snackbarStore.showErrorMessage(`Search Error: ${error}`)
  } finally {
    foundUPCToCopy.value += 1
  }
}

const rulesBeingCopied = ref<typeof SimpleBillList | null>(null)

const emit = defineEmits(['attemptFinish'])
const finishMakingRules = () => {
  emit('attemptFinish', worklist.value)
}
</script>

<template>
  <v-col>
    <v-row>
      <v-col cols="5" class="ma-0 ml-6 mt-4 pa-0">
        <v-row>
          <v-col cols="auto">
            <v-card-text class="ma-0 pa-0 search-field-title" style="font-size: 100%"
              >UPC Code:</v-card-text
            >
            <v-text-field
              clearable
              v-model="searchUPC"
              variant="outlined"
              style="min-width: 200px"
            />
          </v-col>
          <v-col cols="auto">
            <v-card-text class="ma-0 pa-0 search-field-title" style="font-size: 100%"
              >Manufacturer Name:</v-card-text
            >
            <FetchCompany
              v-model="searchManu"
              :placeholder="'Select Manufacturer'"
              style="min-width: 250px"
            />
          </v-col>
          <v-btn
            class="ma-0 pa-0 mt-auto mb-11 ml-4"
            @click="find()"
            :style="{ backgroundColor: stateButtonColor(state) }"
            style="color: white"
            >find</v-btn
          >
        </v-row>
      </v-col>
      <v-col cols="6" class="align-center mx-auto text-center mb-2">
        <v-card-text class="ma-1 mt-0 pa-0 upc-title">UPC Being Copied:</v-card-text>
        <UPCTable v-if="upcToCopy" :UPCsToDisplay="[upcToCopy]" :state="state" :name="false" />
        <v-card-text v-if="!upcToCopy">Search for a UPC to view its rules.</v-card-text>
      </v-col>
    </v-row>
    <hr class="hr-style mt-3 mb-2" style="opacity: 50%" />
    <v-row v-if="!upcToCopy" :key="researched">
      <UPCList
        ref="resultsTable"
        v-model="upcSearchResults"
        :state="state"
        :features="['checkbox', 'noMultiple', 'compact']"
      />
      <v-col class="d-flex flex-column justify-center mx-auto text-center">
        <v-card-text v-if="upcSearchResults.length === 0" style="font-size: 100%"
          >No data.</v-card-text
        >
        <v-btn
          class="justify-center mx-auto"
          :disabled="!enableProceed()"
          @click="assignToCopy(false)"
          :style="{ backgroundColor: stateButtonColor(state) }"
          style="color: white; max-width: 100px"
          >next</v-btn
        >
      </v-col>
    </v-row>
    <v-col v-if="upcToCopy" class="ma-0 pa-0">
      <v-row class="ma-0 pa-0">
        <v-col class="ma-0 pa-0">
          <v-card-title>Select Rules to Copy:</v-card-title>
          <SimpleBillList
            ref="rulesBeingCopied"
            :state="state"
            v-model="worklist"
            :features="['deletable']"
            :key="foundUPCToCopy"
          />
        </v-col>
      </v-row>
      <v-row class="d-flex justify-center mx-auto">
        <v-btn @click="assignToCopy(true)" variant="outlined">reset</v-btn>
        <v-btn
          class="mr-4 ml-4"
          :disabled="worklist.length === 0"
          :style="{ backgroundColor: stateButtonColor(state) }"
          style="color: white"
          @click="finishMakingRules()"
          >Finish</v-btn
        >
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
.upc-title {
  font-size: 110%;
}
</style>
