<script setup lang="ts">
import { VDateInput } from 'vuetify/labs/VDateInput'
import BillingList from '@/renderer/components/billing/VBillingList.vue'
import { backgroundColor, stateButtonColor } from '@/renderer/utils/stateColorGetter'
import StatePicker from '@/renderer/components/common/VStatePicker.vue'
import { ref, computed, onMounted } from 'vue'
import { lists } from '@/renderer/views/billing/sampleData'
import {
  BetterBillingRule,
  BillingRule,
  ReqReadBillingTable,
  RuleDisplay
} from '@/renderer/api/billing/type'
import { useRouter, useRoute } from 'vue-router'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
import { convertDisplayToRule } from '@/renderer/utils/formatting'
import { defaultPaginationData } from '@/renderer/constants/pagination'
import { cloneDeep } from 'lodash-es'
import { getBillingRuleList } from '@/renderer/api/billing'
import FetchCompany from '@/renderer/components/common/autocomplete/fetchCompany.vue'

const router = useRouter()
const route = useRoute()
const snackbarStore = useSnackbarStore()

console.log(route.query)
const currentState = ref<string>(route.query.state ? route.query.state.toString() : '')
const selected = ref<RuleDisplay[]>([])
const billingRules = ref<BetterBillingRule[]>([])

const goToEdit = () => {
  try {
    router.push({
      name: 'BR-Edit',
      query: {
        state: currentState.value,
        rulesBeingUpdated: JSON.stringify(convertDisplayToRule(selected.value))
      }
    })
  } catch (error) {
    snackbarStore.showErrorMessage(`Search Error: ${error}`)
  }
}

// #region Search Result Table

// Search Function
// Step 1: parse search query
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
const formData = ref<ReqReadBillingTable>(cloneDeep(combinedFormData))
const searchStatus = ref<number>(0)
// Step 4: search based on formData
const isLoading = ref(false)
const search = async () => {
  console.log(formData.value)
  formData.value.state = currentState.value
  isLoading.value = true
  try {
    // console.log(formData.value)
    const response = await getBillingRuleList(formData.value)
    billingRules.value = response.data.list
    searchStatus.value += 1
  } catch (error) {
    snackbarStore.showErrorMessage(`Search Error: ${error}`)
  } finally {
    isLoading.value = false
  }
}

const regionList = ref<string[]>()
const regionListStatus = ref<number>(0)
const getRegions = () => {
  try {
    regionList.value = lists.regionsByState.find(
      (regionlist) =>
        regionlist.state.toLocaleLowerCase() === currentState.value.toLocaleLowerCase()
    )?.regions
  } catch {
    console.log('problem in billingresults get regions')
  }
}

onMounted(() => {
  getRegions()
  search()
})
//  #endregion

const clear = () => {
  formData.value.upcCode = null
  formData.value.prodName = null
  formData.value.manufacturer = null
  formData.value.distributor = null
  formData.value.pickupAgent = null
  formData.value.initiator = null
  formData.value.active = true
  formData.value.regions = []
  formData.value.startDate = null
  formData.value.endDate = null
  formData.value.upcs = []
}
</script>

<template>
  <v-container
    class="ma-2 container rounded-lg"
    fluid
    :style="{ backgroundColor: backgroundColor(currentState) }"
  >
    <v-row class="d-flex pb-0 mb-0 ml-0" justify="space-between">
      <v-card-title class="page-header mb-0 mt-4"> Billing Rule Search Results </v-card-title>
      <v-col class="ma-0" cols="auto">
        <StatePicker
          :btn-needed="true"
          :initial="currentState"
          @select-state="
            (state: string) => {
              currentState = state
              search()
            }
          "
        />
      </v-col>
    </v-row>
    <hr class="hr-style mt-0 mb-3" />
    <v-row class="pt-4 pb-0">
      <v-text-field
        class="ml-6 mr-3"
        v-model="formData.upcCode"
        placeholder="Search by UPC"
        :bg-color="'white'"
        variant="outlined"
        style="max-width: 200px"
        clearable
      ></v-text-field>
      <v-text-field
        class="mx-3"
        v-model="formData.prodName"
        placeholder="Search by Product Name"
        :bg-color="'white'"
        variant="outlined"
        style="max-width: 300px"
        clearable
      ></v-text-field>
      <FetchCompany
        v-model="formData.manufacturer"
        :placeholder="'Manufacturer'"
        class="mx-3"
        style="max-width: 300px"
      />
      <v-select
        v-model="formData.regions"
        placeholder="Select Region"
        :items="regionList"
        return-object
        class="mx-3"
        style="max-width: 250px"
        multiple
        :bg-color="'white'"
        variant="outlined"
        clearable
      ></v-select>
      <v-checkbox v-model="formData.active" label="Active Rules Only" class="ml-3" />
      <v-btn
        :ripple="false"
        flat
        variant="outlined"
        :style="{ backgroundColor: 'white' }"
        class="d-flex mb-3 justify-end ml-10"
        @click="search()"
        >reset</v-btn
      >
      <v-btn
        :ripple="false"
        flat
        style="color: white"
        :style="{ backgroundColor: stateButtonColor(currentState) }"
        class="d-flex mb-3 justify-end ml-auto mr-6"
        @click="search()"
        >search</v-btn
      >
    </v-row>
    <v-row class="pb-4">
      <FetchCompany
        v-model="formData.distributor"
        :placeholder="'Select Distributor'"
        style="max-width: 250px"
        class="ml-6 mr-3"
      />
      <FetchCompany
        class="mb-0 pb-0 mx-3"
        v-model="formData.pickupAgent"
        :placeholder="'Select Pickup Agent'"
        style="max-width: 250px"
      />
      <FetchCompany
        v-model="formData.initiator"
        :placeholder="'Select Initiator'"
        style="max-width: 250px"
        class="mx-3"
      />
      <v-row class="mt-0 ml-0">
        <v-date-input
          class="ml-3"
          ref="startDay"
          v-model="formData.startDate"
          prepend-icon=""
          prepend-inner-icon="$calendar"
          variant="outlined"
          :bg-color="'white'"
          style="max-width: 175px; max-height: 7vh"
          clearable
          @click:clear="formData.startDate = null"
        ></v-date-input>
        <v-card-text style="max-width: fit-content; font-size: 150%" class="mt-0 pt-2"
          >-</v-card-text
        >
        <v-date-input
          ref="endDay"
          v-model="formData.endDate"
          prepend-icon=""
          prepend-inner-icon="$calendar"
          style="max-height: 7vh; max-width: 175px"
          variant="outlined"
          :bg-color="'white'"
          clearable
          @click:clear="formData.endDate = null"
        ></v-date-input>
      </v-row>
      <v-btn
        :ripple="false"
        flat
        v-if="formData.upcs && formData.upcs.length > 0"
        style="color: white"
        :style="{ backgroundColor: stateButtonColor(currentState) }"
        class="d-flex mb-3 justify-end ml-auto mt-2"
        @click="
          () => {
            formData.upcs = []
            search()
          }
        "
      >
        <div>remove upc filter</div>
        <v-menu activator="parent" open-on-hover>
          <v-list class="ma-0 pa-0">
            <v-list-item class="mb-0 pb-0">Viewing UPCs:</v-list-item>
            <v-list-item
              v-for="(upc, idx) in formData.upcs"
              :key="idx"
              :value="idx"
              disabled
              class="my-0 py-0"
              density="compact"
            >
              <v-list-item-title>{{ upc }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
      <v-btn
        style="color: white"
        class="d-flex mb-3 mt-2 mr-6"
        :style="{ backgroundColor: stateButtonColor(currentState) }"
        :class="formData.upcs && formData.upcs.length > 0 ? 'ml-4' : 'justify-end ml-auto'"
        @click="goToEdit()"
        :disabled="selected.length === 0"
        >edit</v-btn
      >
    </v-row>
    <BillingList
      :key="searchStatus"
      :state="currentState"
      v-model="selected"
      :rules-to-display="billingRules"
      :features="['checkbox']"
    />
    <v-card-text
      class="d-flex justify-center ml-auto"
      style="font-size: 100%"
      v-if="billingRules.length === 0"
      >No billing rules match your search terms.</v-card-text
    >
  </v-container>
</template>

<style scoped>
@import '@/renderer/styles/lowAdmin.css';
@import '@/renderer/styles/billing.css';
</style>
