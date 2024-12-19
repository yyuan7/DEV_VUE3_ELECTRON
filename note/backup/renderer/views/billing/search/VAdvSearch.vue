<script setup lang="ts">
import { watch, ref, computed, toRaw, reactive } from 'vue'
import {
  backgroundColor,
  stateButtonColor,
  stateCardColor
} from '@/renderer/utils/stateColorGetter'
import StatePicker from '@/renderer/components/common/VStatePicker.vue'
import { SizeRange } from '@/renderer/api/billing/type'
import UPCList from '@/renderer/components/billing/VUPCList.vue'
import { lists } from '../sampleData'
import { useRoute, useRouter } from 'vue-router'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
import { defaultPaginationData, suggestPaginationData } from '@/renderer/constants/pagination'
import { getUpcList } from '@/renderer/api/upc'
import { ReqReadUpcTable, UpcData } from '@/renderer/api/upc/type'
import { cloneDeep, debounce } from 'lodash-es'
import { BeverageType, MaterialType } from '@/renderer/constants/upc'

const route = useRoute()
const router = useRouter()
const state = ref<string>(route.query.state ? route.query.state.toString() : '-')
const results = ref<UpcData[]>([])

const searchTerms = reactive({
  upcCode: null as string | null,
  prodName: null as string | null,
  manufacturer: null as string | null,
  type: null as string | null,
  material: null as string | null,
  size: { min: null, max: null } as SizeRange
})
const searchTable = ref<typeof UPCList | null>(null)
const worklist = ref<typeof UPCList | null>(null)
const searchStarted = ref<number>(0)

const sizeRules = [
  (v: number) =>
    !searchTerms.size.min ||
    !searchTerms.size.max ||
    searchTerms.size.min < searchTerms.size.max ||
    'Invalid'
]

const moveToWorklist = () => {
  const toAdd = searchTable.value?.selected.map((upc: UpcData) => toRaw(upc))
  worklist.value?.addToList(toAdd)
  searchTable.value?.deselectAll()
}

const clearWorklist = () => {
  worklist.value?.clear()
}

const loadState = (selection: string): void => {
  state.value = selection
}

const resultsEmpty = computed(() => searchTable.value?.usableUPCs.length === 0)
const worklistEmpty = computed(() => worklist.value?.usableUPCs.length === 0)

// #region search process

const snackbarStore = useSnackbarStore()
const isLoading = ref(false)
const searchParams = computed(() => {
  const data = route.query.combinedFormData as string
  return data ? JSON.parse(data) : {}
})
// Step 2: update with pagination
const combinedFormData = {
  currentPage: defaultPaginationData.currentPage,
  size: defaultPaginationData.pageSize,
  totalPages: defaultPaginationData.totalPages,
  ...searchParams.value
}
// Step 3: bind all inputs to formData
const formData = ref<ReqReadUpcTable>(cloneDeep(combinedFormData))
// Step 4: search based on formData
const search = async () => {
  if (!formData.value.volumeMax) formData.value.volumeMax = undefined
  if (!formData.value.volumeMin) formData.value.volumeMin = undefined
  isLoading.value = true
  try {
    const response = await getUpcList(formData.value)
    results.value = response.data.list
  } catch (error) {
    snackbarStore.showErrorMessage(`Search Error: ${error}`)
  } finally {
    isLoading.value = false
    searchStarted.value += 1
  }
}

// #endregion

const reset = () => {
  formData.value.upcCode = ''
  formData.value.name = ''
  formData.value.manufacturer = ''
  formData.value.beverageType = undefined
  formData.value.material = undefined
  formData.value.volumeMax = undefined
  formData.value.volumeMin = undefined
}

// #region Auto-Prompt UPC Product Name
const input = ref('')
const suggestion = ref<string[]>([])
const isLoadingName = ref(false)

const fetchNameSuggestion = async () => {
  isLoadingName.value = true
  try {
    const responseUpc = await getUpcList({
      currentPage: suggestPaginationData.currentPage,
      size: suggestPaginationData.pageSize,
      totalPages: suggestPaginationData.totalPages,
      name: input.value
    })
    suggestion.value = [
      ...new Set(responseUpc.data.list.map((manufacturer: UpcData) => manufacturer.name))
    ]
  } catch (error) {
    snackbarStore.showErrorMessage(`Fetching Error: ${error}`)
  } finally {
    isLoadingName.value = false
    formData.value.name = input.value
  }
}

const debouncedFetchsuggestion = debounce(fetchNameSuggestion, 300)
watch(input, (newValue) => {
  debouncedFetchsuggestion()
})

const goToRuleResults = () => {
  console.log('usable upcs:', worklist.value?.usableUPCs)
  try {
    router.push({
      name: 'BR-Result',
      query: {
        combinedFormData: JSON.stringify({
          upcs: worklist.value?.usableUPCs.map((item) => item.upcCode)
        }),
        state: state.value
      }
    })
  } catch (error) {
    snackbarStore.showErrorMessage(`Search Error: ${error}`)
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
      <v-card-title class="page-header"> Search Billing Rules </v-card-title>
      <v-col class="ma-0 pa-0 mb-2" cols="auto">
        <StatePicker
          :states="lists.states"
          :btn-needed="true"
          :initial="state"
          @select-state="loadState"
        />
      </v-col>
    </v-row>
    <hr class="hr-style mt-0 mb-6" />
    <v-card
      class="fee-card pa-3 pb-0 ma-0 mx-3"
      :style="{ backgroundColor: stateCardColor(state) }"
    >
      <v-row class="d-flex mb-0 pb-0" style="max-height: 80px">
        <v-col style="max-width: 200px">
          <v-card-text class="ma-0 pa-0 search-field-title">Search by UPC:</v-card-text>
          <v-text-field
            v-model="formData.upcCode"
            variant="outlined"
            :bg-color="'white'"
            density="compact"
            class="mb-0 pb-0"
            placeholder="e.g. 10000012345"
            clearable
          />
        </v-col>
        <v-col style="max-width: 450px">
          <v-card-text class="ma-0 pa-0 search-field-title">Search by Product Name:</v-card-text>
          <v-autocomplete
            v-model="formData.name"
            variant="outlined"
            :bg-color="'white'"
            density="compact"
            clearable
            placeholder="Enter Product Name"
            v-model:search="input"
            :items="suggestion"
            :loading="isLoading"
            @click="fetchNameSuggestion"
          />
        </v-col>
        <v-col style="max-width: 450px">
          <v-card-text class="ma-0 pa-0 search-field-title">Filter by Manufacturer</v-card-text>
          <v-autocomplete
            v-model="formData.manufacturer"
            variant="outlined"
            :bg-color="'white'"
            density="compact"
            :items="lists.manufacturers"
            clearable
            placeholder="Enter Manufacturer"
          />
        </v-col>
        <v-row class="justify-end ml-auto mt-2 mr-0" style="max-width: 300px">
          <v-btn
            class="mt-10 mr-3"
            icon="mdi-download"
            density="comfortable"
            style="background-color: transparent"
            flat
          />
          <v-btn
            class="mr-4 mt-8"
            :style="{ backgroundColor: '#ededed' }"
            variant="outlined"
            @click="reset()"
          >
            clear
          </v-btn>
          <v-btn
            class="mr-6 mt-8"
            :style="{ backgroundColor: stateButtonColor(state) }"
            style="color: white"
            prepend-icon="mdi-magnify"
            @click="search()"
          >
            <template #prepend>
              <v-icon color="'white'"></v-icon>
            </template>
            search
          </v-btn>
        </v-row>
      </v-row>
      <v-row class="mt-0 pt-0">
        <v-col style="max-width: 300px">
          <v-card-text class="ma-0 pa-0 search-field-title">Filter by Type:</v-card-text>
          <v-autocomplete
            v-model="formData.beverageType"
            class="ma-0 pa-0"
            :bg-color="'white'"
            variant="outlined"
            density="compact"
            :items="Object.values(BeverageType)"
            clearable
            placeholder="Enter Beverage Type"
          />
        </v-col>
        <v-col style="max-width: 300px">
          <v-card-text class="ma-0 pa-0 search-field-title">Filter by Material:</v-card-text>
          <v-autocomplete
            v-model="formData.material"
            class="ma-0 pa-0"
            :bg-color="'white'"
            variant="outlined"
            density="compact"
            :items="Object.values(MaterialType)"
            clearable
            placeholder="Enter Material"
          />
        </v-col>
        <v-col>
          <v-card-text class="ma-0 pa-0 search-field-title">Size:</v-card-text>
          <v-row class="ma-0 pa-0">
            <v-text-field
              v-model="formData.volumeMin"
              class="ma-0 pa-0"
              :bg-color="'white'"
              variant="outlined"
              style="max-width: 70px"
              density="compact"
              placeholder="--"
              :rules="sizeRules"
              type="number"
            />
            <v-card-text class="ma-0 mx-6 mt-2 pa-0" style="max-width: fit-content; font-size: 150%"
              >-</v-card-text
            >
            <v-text-field
              v-model="formData.volumeMax"
              class="ma-0 pa-0"
              :bg-color="'white'"
              variant="outlined"
              style="max-width: 70px"
              density="compact"
              placeholder="--"
              :rules="sizeRules"
              type="number"
            />
            <v-card-text class="ma-0 mx-6 mt-2 pa-0" style="max-width: fit-content; font-size: 120%"
              >oz.</v-card-text
            >
          </v-row>
        </v-col>
      </v-row>
    </v-card>
    <v-row class="pa-0 ma-0 mx-2">
      <v-col cols="6" class="pa-0 pt-3">
        <v-card
          class="fee-card"
          :style="{ backgroundColor: stateCardColor(state) }"
          style="height: 51vh"
        >
          <v-row class="d-flex mt-0 ml-0 mb-2">
            <v-card-title class="mt-2 ml-4 section-titles">Search Results:</v-card-title>
            <v-btn
              class="justify-end ml-auto mt-3 mr-7"
              :style="{ backgroundColor: stateButtonColor(state) }"
              style="color: white"
              @click="moveToWorklist()"
              >Add >></v-btn
            >
          </v-row>
          <UPCList
            ref="searchTable"
            :key="searchStarted"
            :state="state"
            v-model="results"
            :features="['checkbox']"
          />
          <v-card-text
            v-if="resultsEmpty && searchStarted === 0"
            class="d-flex justify-center align-center w-100"
            >Search for UPCs to get started.</v-card-text
          >
          <v-card-text
            v-if="resultsEmpty && searchStarted > 0"
            class="d-flex justify-center align-center w-100"
            >No results.</v-card-text
          >
        </v-card>
      </v-col>
      <v-col cols="6" class="pa-0 pt-3">
        <v-card
          class="fee-card"
          :style="{ backgroundColor: stateCardColor(state) }"
          style="height: 51vh; min-height: fit-content"
        >
          <v-card-title class="mt-2 ml-4 mb-2 section-titles">Worklist:</v-card-title>
          <UPCList ref="worklist" :state="state" :upcs="[]" :features="['deletable']" />
          <v-card-text v-if="worklistEmpty" class="d-flex justify-center align-center w-100"
            >Worklist is empty. Add some UPCs!</v-card-text
          >
          <v-row class="d-flex justify-end align-bottom mt-auto">
            <v-btn
              :style="{ backgroundColor: '#ededed' }"
              variant="outlined"
              :disabled="worklistEmpty"
              @click="clearWorklist()"
              >clear</v-btn
            >
            <v-btn
              class="mr-7 ml-4"
              :style="{ backgroundColor: stateButtonColor(state) }"
              style="color: white"
              :disabled="worklistEmpty"
              @click="goToRuleResults()"
              >view rules</v-btn
            >
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
@import '@/renderer/styles/lowAdmin.css';
@import '@/renderer/styles/billing.css';
</style>
