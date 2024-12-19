<script setup lang="ts">
import StatePicker from '@/renderer/components/common/VStatePicker.vue'
import { VDateInput } from 'vuetify/labs/VDateInput'
import {
  backgroundColor,
  stateButtonColor,
  stateCardColor
} from '@/renderer/utils/stateColorGetter'
import { lists } from '../sampleData'
import { ref, reactive, watch } from 'vue'
import { ReqSearchOrFilterBRules } from '@/renderer/api/billing/type'
import { useRouter, useRoute } from 'vue-router'
import { closeCurrentTag } from '@/renderer/utils/tag/close'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
// experimental - AUTO-FETCH
import FetchCompany from '@/renderer/components/common/autocomplete/fetchCompany.vue'

const state = ref<string>('-')
const loadState = (selection: string): void => {
  state.value = selection
}
const router = useRouter()
const route = useRoute()

const filterTerms = reactive({
  distributor: null as string | null,
  pickupAgent: null as string | null,
  regions: [] as string[],
  initiator: null as string | null,
  active: true,
  startDate: null as Date | null,
  endDate: null as Date | null
})

const searchTerms = reactive({
  upcCode: null as string | null,
  prodName: null as string | null,
  manufacturer: null as string | null
})

const clear = () => {
  console.log('clearing')
  for (const field of ['upcCode', 'prodName', 'manufacturer'] as (keyof typeof searchTerms)[]) {
    searchTerms[field] = null
  }
  filterTerms.distributor = null
  filterTerms.pickupAgent = null
  filterTerms.initiator = null
  filterTerms.active = true
  filterTerms.regions = []
  filterTerms.startDate = null
  filterTerms.endDate = null
}

const cancel = () => {
  clear()
  closeCurrentTag(router, route)
}

const advance = () => {
  // goes to advanced search page
  console.log('advanced search time!')
  try {
    router.push({
      name: 'BR-Adv-Search',
      query: {
        state: state.value
      }
    })
  } catch (error) {
    snackbarStore.showErrorMessage(`Search Error: ${error}`)
  }
}

const checkDates = () => {
  return (
    !filterTerms.startDate || !filterTerms.endDate || filterTerms.startDate <= filterTerms.endDate
  )
}

const dateRules = [(date: Date) => checkDates() || 'Invalid date range.']

const combinedSearchParams = ref<ReqSearchOrFilterBRules | null>(null)
const snackbarStore = useSnackbarStore()
const search = () => {
  if (!checkDates()) {
    console.warn('Invalid date range!')
    return
  }
  combinedSearchParams.value = {
    ...searchTerms,
    ...filterTerms
  }

  // Send the merged data to the backend
  if (combinedSearchParams.value) {
    try {
      router.push({
        name: 'BR-Result',
        query: {
          combinedFormData: JSON.stringify(combinedSearchParams.value),
          state: state.value
        }
      })
    } catch (error) {
      snackbarStore.showErrorMessage(`Search Error: ${error}`)
    }
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
        <StatePicker :states="lists.states" :btn-needed="true" @select-state="loadState" />
      </v-col>
    </v-row>
    <hr class="hr-style mt-0 mb-6" />
    <v-row class="d-flex justify-end ml-auto mr-4">
      <v-btn class="mr-4" @click="clear()">Clear</v-btn>
      <v-btn
        style="color: white"
        :style="{ backgroundColor: stateButtonColor(state) }"
        @click="advance()"
        >Advanced Search</v-btn
      >
    </v-row>
    <v-card class="fee-card mt-6" :style="{ backgroundColor: stateCardColor(state) }">
      <v-card-title class="fee-update-title" style="font-style: normal">Search By:</v-card-title>
      <v-row class="mb-1">
        <v-col class="ml-6 mr-3">
          <v-card-text class="search-field-title">Enter UPC Code</v-card-text>
          <v-text-field
            v-model="searchTerms.upcCode"
            placeholder="Enter UPC Code"
            :bg-color="'white'"
            variant="outlined"
            clearable
          ></v-text-field>
        </v-col>
        <v-col class="mx-3">
          <v-card-text class="search-field-title">Enter Product Name</v-card-text>
          <v-text-field
            v-model="searchTerms.prodName"
            placeholder="Enter Product Name"
            :bg-color="'white'"
            variant="outlined"
            clearable
          ></v-text-field>
        </v-col>
        <v-col class="ml-3 mr-6">
          <v-card-text class="search-field-title">Select Manufacturer</v-card-text>
          <FetchCompany v-model="searchTerms.manufacturer" :placeholder="'Select Manufacturer'" />
        </v-col>
      </v-row>
    </v-card>
    <v-card class="fee-card" :style="{ backgroundColor: stateCardColor(state) }">
      <v-card-title class="fee-update-title" style="font-style: normal">Filter By:</v-card-title>
      <v-row class="mb-0 pb-0">
        <v-col class="ml-6 mr-3 mb-0 pb-0">
          <v-card-text class="search-field-title">Select Distributor</v-card-text>
          <FetchCompany v-model="filterTerms.distributor" :placeholder="'Select Distributor'" />
          <v-card-text class="search-field-title">Select Pickup Agent</v-card-text>
          <FetchCompany
            class="mb-0 pb-0"
            v-model="filterTerms.pickupAgent"
            :placeholder="'Select Pickup Agent'"
          />
        </v-col>
        <v-col class="mx-3 mb-0 pb-0">
          <v-card-text class="search-field-title">Select Regions</v-card-text>
          <v-select
            v-model="filterTerms.regions"
            placeholder="Select Region"
            :items="lists.regions"
            return-object
            multiple
            :bg-color="'white'"
            variant="outlined"
            clearable
          ></v-select>
          <v-card-text class="search-field-title">Select Initiator</v-card-text>
          <FetchCompany v-model="filterTerms.initiator" :placeholder="'Select Initiator'" />
        </v-col>
        <v-col class="ml-3 mr-6 mt-8 mb-0 pb-0">
          <v-checkbox v-model="filterTerms.active" label="Active Rules Only" />
          <v-row>
            <v-col>
              <v-card-text class="search-field-title">Start Date (Active since...)</v-card-text>
              <v-form ref="form1">
                <v-date-input
                  ref="startDay"
                  v-model="filterTerms.startDate"
                  prepend-icon=""
                  prepend-inner-icon="$calendar"
                  variant="outlined"
                  :bg-color="'white'"
                  :rules="dateRules"
                  clearable
                  @click:clear="filterTerms.startDate = null"
                ></v-date-input>
              </v-form>
            </v-col>
            <v-col>
              <v-card-text class="search-field-title">End Date (Active to...)</v-card-text>
              <v-date-input
                ref="endDay"
                v-model="filterTerms.endDate"
                prepend-icon=""
                prepend-inner-icon="$calendar"
                variant="outlined"
                :bg-color="'white'"
                :rules="dateRules"
                clearable
                @click:clear="filterTerms.endDate = null"
              ></v-date-input>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
    <v-row class="d-flex justify-end ml-auto mr-4 mt-4 pa-0">
      <v-btn class="mr-4" @click="cancel()">cancel</v-btn>
      <v-btn
        style="color: white"
        :style="{ backgroundColor: stateButtonColor(state) }"
        @click="search()"
        >search</v-btn
      >
    </v-row>
  </v-container>
</template>

<style scoped>
@import '@/renderer/styles/lowAdmin.css';
@import '@/renderer/styles/billing.css';
</style>
