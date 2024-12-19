<script setup lang="ts">
import {
  backgroundColor,
  stateButtonColor,
  stateCardColor,
  tableHeaderColor
} from '@/renderer/utils/stateColorGetter'
import StatePicker from '@/renderer/components/common/VStatePicker.vue'
import BillingList from '@/renderer/components/billing/VBillingList.vue'
import Chart from 'chart.js/auto'
import { ref, watch, onMounted } from 'vue'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
import { UpcData } from '@/renderer/api/upc/type'
import { useRouter, useRoute } from 'vue-router'
import { BetterBillingRule } from '@/renderer/api/billing/type'
import { defaultPaginationData } from '@/renderer/constants/pagination'
import { cloneDeep } from 'lodash-es'
import { getBillingRuleList, getRulesForUPC } from '@/renderer/api/billing'

const props = defineProps<{
  state: string
  missingData: boolean
}>()

const route = useRoute()

const upc = ref<UpcData>(JSON.parse(route.query.upcToParse as string))

const currentState = ref<string>(props.state)
const snackbarStore = useSnackbarStore()
const router = useRouter()
const viewAllRules = () => {
  try {
    router.push({
      name: 'BR-Result',
      query: {
        combinedFormData: JSON.stringify({
          upcs: [upc.value.upcCode]
        }),
        state: currentState.value
      }
    })
  } catch (error) {
    snackbarStore.showErrorMessage(`Search Error: ${error}`)
  }
}

/// ////////////////////// chart
const generateColors = (numColors: number) => {
  const headColor = tableHeaderColor(currentState.value)
  const endColor = headColor?.match(/\d+/g)?.map(Number)
  const startColor = [255, 255, 255]
  if (!endColor) return
  const colors: Array<string> = []
  for (let i = 0; i < numColors - 1; i++) {
    const red = Math.round(startColor[0] + (i / (numColors - 1)) * (endColor[0] - startColor[0]))
    const green = Math.round(startColor[1] + (i / (numColors - 1)) * (endColor[1] - startColor[1]))
    const blue = Math.round(startColor[2] + (i / (numColors - 1)) * (endColor[2] - startColor[2]))
    colors.push('rgb(' + red + ', ' + green + ', ' + blue + ')')
  }
  colors.push(headColor || 'red')
  return colors
}

const currentColors = ref<string[] | undefined>()
const regionPercents = ref<string[]>([])

const ruleTable = ref<typeof BillingList>()
const data = {
  labels: ['a', 'b'],
  datasets: [
    {
      data: [0],
      hoverOffset: 10,
      backgroundColor: ['red', 'blue', 'green']
    }
  ]
}
const config = {
  type: 'doughnut',
  data,
  options: {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true
      },
      legend: {
        display: false
      }
    }
  }
}

const billingCategories = ref<Chart>()
const missingRules = ref<boolean>(false)
const renderChart = async () => {
  missingRules.value = false
  const countResult = await (
    await getRulesForUPC({
      upcCode: upc.value.upcCode,
      state: currentState.value.toLocaleLowerCase()
    })
  ).data.info

  const totalRulesNeeded = parseInt(countResult.split('/')[1])

  const ruleArray = ruleTable.value?.dataToDisplay.map((a: any) => a.regions.length)
  let presentRules = 0
  if (ruleArray) ruleArray.forEach((ruleCount: number) => (presentRules += ruleCount))
  const missing = totalRulesNeeded - presentRules
  // push data into data array
  const newData = ruleTable.value?.dataToDisplay.map((a: any) => a.regions.length)
  data.datasets[0].data = newData || []
  data.datasets[0].data?.unshift(missing)
  // create labels array
  regionPercents.value = ruleTable.value?.dataToDisplay.map((a: any) =>
    ((a.regions.length * 100) / totalRulesNeeded).toFixed(2)
  )
  regionPercents.value?.unshift(((missing * 100) / totalRulesNeeded).toFixed(2))
  data.labels = regionPercents.value
    ? regionPercents.value.map((a: any, index) => 'Pattern ' + index + ': ' + a + '%')
    : []
  if (missing > 0) {
    data.labels?.unshift(
      'Regions with missing rules: ' +
        ((data.datasets[0].data[0] * 100) / totalRulesNeeded).toFixed(2) +
        '%'
    )
    missingRules.value = true
  }
  // get colors
  if (presentRules > 0) currentColors.value = generateColors(data.labels.length)
  else currentColors.value = ['white']
  data.datasets[0].backgroundColor = currentColors.value ? currentColors.value : []
  // create the chart
  billingCategories.value = new Chart(document.getElementById('billingCategories'), config)
}

// #region getting rules

const searchStatus = ref<number>(0)
const isLoading = ref(false)
const retrievedRules = ref<BetterBillingRule[]>([])

const search = async () => {
  if (billingCategories.value) billingCategories.value.destroy()
  const formData = {
    currentPage: defaultPaginationData.currentPage,
    size: defaultPaginationData.pageSize,
    totalPages: defaultPaginationData.totalPages,
    active: true,
    state: currentState.value,
    upcs: [upc.value.upcCode]
  }
  isLoading.value = true
  try {
    // console.log(formData.value)
    const response = await getBillingRuleList(formData)
    retrievedRules.value = response.data.list
  } catch (error) {
    snackbarStore.showErrorMessage(`Search Error: ${error}`)
  } finally {
    isLoading.value = false
    searchStatus.value += 1
    if (retrievedRules.value.length === 0) retrievedRules.value = []
  }
}
onMounted(() => {
  search()
})

// #endregion

const reassignState = (state: string) => {
  currentState.value = state
  search()
}
watch(ruleTable, (newValue) => {
  if (billingCategories.value) billingCategories.value.destroy()
  renderChart()
})

const addRules = () => {
  try {
    router.push({
      name: 'BR-Add',
      query: {
        state: currentState.value,
        upcs: JSON.stringify({ upcs: [upc.value.upcCode] })
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
    :style="{ backgroundColor: backgroundColor(currentState) }"
  >
    <v-row class="d-flex pb-0 mb-0 ml-0" justify="space-between">
      <v-card-title class="page-header"> UPC: {{ upc.upcCode }} - {{ upc.name }} </v-card-title>
      <div v-if="missingData" class="alert-msg rounded-pill mt-3 mr-8">
        incomplete package info
      </div>
    </v-row>
    <hr class="hr-style mt-0 mb-2" />
    <v-row class="justify-end ml-auto mt-0 mb-4">
      <StatePicker
        :btn-needed="true"
        :initial="currentState"
        @select-state="(state: string) => reassignState(state)"
      />
    </v-row>
    <v-row>
      <v-col cols="3" class="ma-0 mt-0 pl-6 pr-0 pa-0">
        <v-card :style="{ backgroundColor: stateCardColor(currentState) }" style="min-height: 50vh">
          <v-card-title class="fee-update-title ma-0 pa-0 pt-2 pl-4"
            >Billing Rules by Pattern</v-card-title
          >
          <div class="pt-4 px-4 pb-14 mb-0" style="position: relative; width: 23vw">
            <canvas id="billingCategories"></canvas>
          </div>
          <v-row class="px-10">
            <v-row class="mb-6">
              <v-btn
                class="rounded-pill"
                flat
                :color="'white'"
                style="border: 1px solid white"
              ></v-btn>
              <v-col class="ma-0 pa-0">
                <v-card-text class="ma-0 pa-0 pt-0 pl-3 search-field-title"
                  >Regions with No Active Rules
                </v-card-text>
                <v-card-text class="ma-0 pa-0 pl-3" style="font-weight: bold; font-size: 100%"
                  >{{ regionPercents ? regionPercents[0] : '100' }}%</v-card-text
                >
              </v-col>
            </v-row>
            <div v-for="(item, idx) of ruleTable?.dataToDisplay" class="ma-0 pa-0" :key="idx">
              <v-row class="mb-6">
                <v-btn
                  class="rounded-pill"
                  flat
                  :color="currentColors ? currentColors[idx + 1] : 'red'"
                  style="border: 2px solid white"
                ></v-btn>
                <v-col class="ma-0 pa-0">
                  <v-card-text class="ma-0 pa-0 pt-0 pl-3 search-field-title"
                    >Regions with Pattern {{ item.ruleID }}</v-card-text
                  >
                  <v-card-text class="ma-0 pa-0 pl-3" style="font-weight: bold; font-size: 100%"
                    >{{ regionPercents[idx + 1] }}%</v-card-text
                  >
                </v-col>
              </v-row>
            </div>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="9" class="mt-0 pa-0 pr-4 pl-12">
        <v-card
          :style="{ backgroundColor: stateCardColor(currentState) }"
          class="mr-3"
          style="min-height: 70vh"
        >
          <v-row class="ma-0 pa-0">
            <v-card-title class="fee-update-title ma-0 pa-0 pt-2 pl-4"
              >Currently Active Billing Rules</v-card-title
            >
            <div
              v-if="missingRules"
              class="alert-msg rounded-pill justify-end ml-auto mr-6 mt-4 px-3"
              style="width: fit-content"
            >
              Missing Billing Rules
            </div>
            <v-btn
              :class="!missingRules ? 'justify-end ml-auto mt-2 mr-3' : 'mt-2 mr-3'"
              style="color: white"
              :style="{ backgroundColor: stateButtonColor(currentState) }"
              @click="viewAllRules()"
              >view all rules</v-btn
            >
          </v-row>
          <v-row class="ma-0 mt-2 pa-3 rounded-lg">
            <BillingList
              ref="ruleTable"
              :upcCode="upc.upcCode"
              :key="searchStatus"
              :state="currentState"
              :rules-to-display="retrievedRules"
              :features="['no-upc', 'number']"
            />
          </v-row>
          <v-card-text
            class="d-flex justify-center ml-auto"
            style="font-size: 100%"
            v-if="retrievedRules.length === 0"
            >No active billing rules.</v-card-text
          >
          <v-btn
            v-if="missingRules"
            class="d-flex justify-center mx-auto"
            style="color: white"
            :style="{ backgroundColor: stateButtonColor(currentState) }"
            @click="addRules()"
            >add rules</v-btn
          >
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
@import '@/renderer/styles/lowAdmin.css';
@import '@/renderer/styles/billing.css';
.alert-msg {
  background-color: #f7d1d1;
  outline: auto red;
  outline-style: dashed;
  max-height: 24px;
  width: 200px;
  text-align: center;
}
.list-wrapper {
  display: block;
  column-count: 2;
}
</style>
