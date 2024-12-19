<script setup lang="ts">
import { BillingRule } from '@/renderer/api/billing/type'
import { stateButtonColor } from '@/renderer/utils/stateColorGetter'
import SimpleBillList from '@/renderer/components/billing/VSimpleBillList.vue'
import UPCList from '../VUPCList.vue'
import UPCTable from '../VUpcTable.vue'
import { lists, billingRules as rules, upcs } from '@/renderer/views/billing/sampleData'
import { ref, toRaw } from 'vue'
// AUTO-FETCH
import FetchCompany from '../../common/autocomplete/fetchCompany.vue'
import { UpcData } from '@/renderer/api/upc/type'
import { getUpcList } from '@/renderer/api/upc'
import { defaultPaginationData } from '@/renderer/constants/pagination'
import { getBillingRuleList } from '@/renderer/api/billing'

const props = defineProps<{
  state: string
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
    console.log(response.data.list)
  } catch (error) {
    // snackbarStore.showErrorMessage(`Search Error: ${error}`)
  } finally {
    upcToCopy.value = null
    researched.value = researched.value + 1
  }
}

const enableProceed = () => {
  return resultsTable.value?.selected[0]
}

const rulesToCopy = ref<BillingRule[]>([])
const foundUPCToCopy = ref<number>(0)
const assignToCopy = async () => {
  upcToCopy.value = enableProceed()

  if (!upcToCopy.value) return
  console.log('lets copy', upcToCopy.value.upcCode)
  const formData = {
    currentPage: defaultPaginationData.currentPage,
    size: defaultPaginationData.pageSize,
    totalPages: defaultPaginationData.totalPages,
    upcs: [upcToCopy.value.upcCode],
    state: props.state
  }
  try {
    const response = await getBillingRuleList(formData)

    rulesToCopy.value = response.data.list
    console.log('ok lets take a look', rulesToCopy.value)
  } catch (error) {
    // snackbarStore.showErrorMessage(`Search Error: ${error}`)
  } finally {
    foundUPCToCopy.value += 1
  }
}

//  copy rules //
const sourceRules = ref<typeof SimpleBillList | null>(null)
const rulesBeingCopied = ref<typeof SimpleBillList | null>(null)
const worklist = ref<BillingRule[]>([])

const moveToCopy = () => {
  const toAdd = sourceRules.value?.selected.map((rule: BillingRule) => toRaw(rule))
  const beingAdded: BillingRule[] = []
  toAdd.forEach((rule: BillingRule) =>
    beingAdded.push({
      id: rule.id,
      upcCode: '-1',
      state: rule.state,
      region: '',
      initiator: rule.initiator,
      pickupAgent: rule.pickupAgent,
      distributor: rule.distributor,
      startDate: rule.startDate,
      endDate: rule.endDate,
      dateAdded: new Date(),
      author: 'ee' // author will need to be id of active user
    })
  )
  rulesBeingCopied.value?.addAndReplace(beingAdded)
  sourceRules.value?.deselectAll()
}

const clearAddedRules = () => {
  rulesBeingCopied.value?.clear()
}

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
          <v-col cols="6">
            <v-card-text class="ma-0 pa-0 search-field-title" style="font-size: 100%"
              >Manufacturer Name:</v-card-text
            >
            <FetchCompany v-model="searchManu" :placeholder="'Select Manufacturer'" />
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
      <v-col cols="6" class="align-center mx-auto">
        <v-row v-if="upcToCopy">
          <UPCTable
            :key="foundUPCToCopy"
            :UPCsToDisplay="[upcToCopy]"
            :state="state"
            :name="false"
          />
        </v-row>
      </v-col>
    </v-row>
    <hr class="hr-style mt-3 mb-6" style="opacity: 50%" />
    <v-row v-if="!upcToCopy">
      <UPCList
        ref="resultsTable"
        v-model="upcSearchResults"
        :state="state"
        :features="['checkbox', 'noMultiple', 'compact']"
        :key="researched"
      />
      <v-btn
        :disabled="!enableProceed()"
        class="d-flex justify-center mx-auto"
        @click="assignToCopy()"
        :style="{ backgroundColor: stateButtonColor(state) }"
        style="color: white"
        >next</v-btn
      >
    </v-row>
    <v-col v-if="upcToCopy" class="ma-0 pa-0">
      <v-row class="ma-0 pa-0">
        <v-col class="ma-0 pa-0">
          <v-card-text class="search-field-title"
            >Copy from UPC: {{ upcToCopy?.upcCode }}</v-card-text
          >
          <SimpleBillList
            ref="sourceRules"
            :state="state"
            v-model="rulesToCopy"
            :features="['checkbox', 'single']"
          />
        </v-col>
        <v-col class="ma-0 pa-0">
          <v-row class="position-relative justify-center mx-auto">
            <v-divider vertical color="'black'" :thickness="3" style="min-height: 25vh" />
            <v-col class="position-absolute d-flex flex-column align-center justify-center mt-3">
              <v-btn
                class="d-flex justify-center mx-auto my-1 mx-0"
                prepend-icon="mdi-plus"
                @click="moveToCopy()"
                :style="{ backgroundColor: stateButtonColor(state) }"
                style="color: white"
                >add</v-btn
              >
              <v-btn
                class="d-flex justify-center mx-auto my-1"
                @click="clearAddedRules()"
                variant="outlined"
                style="background-color: white"
                >clear</v-btn
              >
            </v-col>
          </v-row>
        </v-col>
        <v-col class="ma-0 pa-0">
          <v-card-text class="search-field-title">Rules being copied:</v-card-text>
          <SimpleBillList
            ref="rulesBeingCopied"
            :state="state"
            v-model="worklist"
            :features="['deletable']"
          />
        </v-col>
      </v-row>
      <v-btn
        :disabled="worklist.length === 0"
        class="d-flex justify-end ml-auto"
        :style="{ backgroundColor: stateButtonColor(state) }"
        style="color: white"
        @click="finishMakingRules()"
        >Finish</v-btn
      >
    </v-col>
  </v-col>
</template>

<style scoped>
@import '@/renderer/styles/lowAdmin.css';
@import '@/renderer/styles/billing.css';
.position-relative {
  position: relative;
}
</style>
