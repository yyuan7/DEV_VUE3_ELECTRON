<!-- TODO: loadBillingDash, getRuleCount, addToTodo -->
<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUpcInfo } from '@/renderer/api/upc'
import { UpcData, ResReadUpcList } from '@/renderer/api/upc/type'
import { BeverageType, MaterialType, StateType, RegionCount } from '@/renderer/constants/upc'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
import { closeCurrentTag } from '@/renderer/utils/tag/close'
import { getNotesAsString } from '@/renderer/utils/formatting'
import { getRulesForUPC } from '@/renderer/api/billing'
import { stateButtonColor } from '@/renderer/utils/stateColorGetter'
import { addToDoItem } from '@/renderer/api/upc-lists'
import { ToDoItem } from '@/renderer/api/upc-lists/type'
import { useUserStore } from '@/renderer/store/modules/userStore'

const route = useRoute()
const router = useRouter()
const snackbarStore = useSnackbarStore()
const upcCode = route.params.upcCode

const upcData: UpcData = reactive({})

const injectData = async () => {
  const upcCode = route.params.upcCode
  upcData.upcCode = upcCode as string

  try {
    const response: ResReadUpcList = await getUpcInfo(upcCode as string)
    if (response.code === 200) {
      const targetUpc = response.data.list.at(0)

      if (targetUpc) {
        upcData.upcCode = targetUpc.upcCode
        upcData.name = targetUpc.name || ''
        upcData.manufacturer = targetUpc.manufacturer || undefined
        upcData.material = (targetUpc.material as MaterialType) || undefined
        upcData.beverageType = (targetUpc.beverageType as BeverageType) || undefined
        upcData.volumeSize = targetUpc.volumeSize || undefined
        upcData.weight = targetUpc.weight || undefined
        upcData.firstScanDate = targetUpc.firstScanDate || ''
        upcData.lastScanDate = targetUpc.lastScanDate || ''
        upcData.totalScanUnit = targetUpc.totalScanUnit || undefined
        upcData.notes = targetUpc.notes || []
        upcData.completeUPCInfo = targetUpc.completeUPCInfo || false
      } else {
        // prevent accessing UPC not exist
        snackbarStore.showErrorMessage(`Search Failed: ${response.data.message}`)
        closeCurrentTag(router, route)
        router.push({ path: '/404' })
      }
    }
  } catch (error) {
    snackbarStore.showErrorMessage(`Search Error: ${error}`)
  }
}

onMounted(() => injectData())
//  #endregion

// Methods
const loadBillingDash = (state: string) => {
  // insert code to switch to billing rule dashboard for given state
  try {
    router.push({
      path: `${route.path}/${state}`,
      query: {
        state: state,
        upcToParse: JSON.stringify(upcData)
      }
    })
  } catch (error) {
    snackbarStore.showErrorMessage(`Search Error: ${error}`)
  }
}
interface StateRule {
  state: StateType
  ruleStatus: string
}
const statesAndRules = ref<StateRule[]>([])
const stateRuleMeasures = ref<number>(0)
const populateStateRules = () => {
  try {
    Object.values(StateType).forEach(async (state) => {
      statesAndRules.value.push({
        state: state,
        ruleStatus: await (
          await getRulesForUPC({ upcCode: upcData.upcCode, state: state.toLocaleLowerCase() })
        ).data.info
      })
    })
  } finally {
    stateRuleMeasures.value += 1
  }
}

const getRuleCount = (state) => {
  const item = statesAndRules.value.find(
    (item) => item.state.toLocaleLowerCase() === state.toLocaleLowerCase()
  )
  return item?.ruleStatus
}

const checkComplete = () => {
  return upcData.completeUPCInfo
}

const getNotes = (notes) => {
  return getNotesAsString(notes)
}

const userStore = useUserStore()
const addToTodo = () => {
  if (!upcCode) return
  const newToDoItem: ToDoItem = {
    upcCode: upcData.upcCode,
    state: '',
    userID: userStore.userId,
    status: true
  }
  const test = addToDoItem(newToDoItem)
  console.log('added upc ', upcData.upcCode, ' to to-do')
}

const goToEdit = () => router.push({ path: `/upc/edit/${upcCode}` })

onMounted(() => {
  populateStateRules()
})
</script>

<template>
  <v-container class="container rounded-lg ml-4 mr-16" fluid>
    <v-row>
      <v-card-title class="ml-3 mt-0 mb-0" style="font-size: 200%; font-weight: bold"
        >UPC: {{ upcCode }}</v-card-title
      >
      <v-col class="pt-2">
        <div v-if="!checkComplete()" class="alert-msg rounded-pill"> incomplete package info </div>
      </v-col>
      <v-row class="justify-end pr-9 pt-6">
        <v-btn class="action-btn" @click="goToEdit()">
          <v-icon color="white"> mdi-pencil </v-icon>
          edit
        </v-btn>
        <v-btn class="action-btn" @click="addToTodo()">
          <v-icon color="white">mdi-plus</v-icon>
          to-do
        </v-btn>
      </v-row>
    </v-row>
    <hr class="hr-style" />
    <v-row>
      <v-col class="dash-section rounded-lg" name="billingRules">
        <v-card-title class="head-1">Billing Rules</v-card-title>
        <v-data-table class="billing-rules" hide-default-footer :key="stateRuleMeasures">
          <thead>
            <tr>
              <th class="table-header" style="font-weight: 900">State</th>
              <th class="table-header" style="font-weight: 900">Progress</th>
              <th class="table-header" style="font-weight: 900">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(value, index) in StateType" :key="index">
              <td class="upc-data">{{ value }}</td>
              <td class="upc-data">{{ getRuleCount(value) }}</td>
              <td class="billing-row-item">
                <v-btn
                  class="view-button"
                  depressed
                  variant="outlined"
                  @click="loadBillingDash(value)"
                  >view</v-btn
                >
              </td>
            </tr>
          </tbody>
        </v-data-table>
      </v-col>
      <v-col class="dash-section rounded-lg" name="stats">
        <v-card-title class="head-1">Statistics</v-card-title>
        <v-data-table class="stats-table" hide-default-footer>
          <thead>
            <tr>
              <th class="table-header" style="font-weight: 900"> First Scanned </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="d-flex justify-center stats-data">
                  {{ upcData.firstScanDate }}
                </div>
              </td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th class="table-header" style="font-weight: 900"> Last Scanned </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="d-flex justify-center stats-data">
                  {{ upcData.lastScanDate }}
                </div>
              </td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th class="table-header" style="font-weight: 900"> Total Units Processed </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="d-flex justify-center stats-data">
                  {{ upcData.totalScanUnit }}
                </div>
              </td>
            </tr>
          </tbody>
        </v-data-table>
      </v-col>
      <v-col class="dash-section rounded-lg" name="notes">
        <v-card-title class="head-1">Note History</v-card-title>
        <v-textarea
          :bg-color="'white'"
          class="note-field rounded-md"
          hide-details
          :model-value="getNotes(upcData.notes)"
          no-resize
          readonly
          rows="10"
          variant="outlined"
        >
        </v-textarea>
      </v-col>
    </v-row>
    <v-container class="mt-10" name="info">
      <v-col class="info-section rounded-lg" name="notes">
        <v-card-title class="head-1">Product Information</v-card-title>
        <v-data-table hide-default-footer>
          <thead>
            <th
              v-for="(value, index) in [
                'Product Name',
                'Manufacturer',
                'Beverage Type',
                'Material',
                'Volume (oz)',
                'Weight (lbs)'
              ]"
              :key="index"
              class="table-header data-table"
            >
              {{ value }}
            </th>
          </thead>
          <tbody>
            <td
              v-for="(value, index) in [
                upcData.name,
                upcData.manufacturer,
                upcData.beverageType,
                upcData.material,
                upcData.volumeSize,
                upcData.weight
              ]"
              :key="index"
              class="upc-data"
            >
              <div class="d-flex justify-center">
                {{ value }}
              </div>
            </td>
          </tbody>
        </v-data-table>
      </v-col>
    </v-container>
  </v-container>
</template>

<style>
@import '../upcMgmt.css';
@import '@/renderer/styles/lowAdmin.css';
@import '@/renderer/styles/billing.css';
.dash-section {
  background-color: #bbdbb2;
  margin-top: 1%;
  margin-left: 2%;
  margin-right: 2%;
  height: 40vh;
  min-height: fit-content;
}
.table-header {
  font-weight: 900;
  font-size: 120%;
  text-align: center !important;
  vertical-align: middle !important;
  background-color: #bdbdbd;
}
.stats-table {
  padding: 2%;
  min-height: 83%;
  padding-bottom: 0%;
  margin-bottom: 0%;
}
.data-table {
  padding: 1%;
}
.note-field {
  min-height: none;
  border-radius: 2%;
  color: rgb(79, 79, 79);
  padding-bottom: 0%;
  margin-bottom: 0%;
}
.info-section {
  background-color: #bbdbb2;
  margin-top: 0%;
}
.stats-data {
  padding: 3%;
  min-height: 16%;
}
.hr-style {
  border: 0;
  margin: 1%;
  margin-top: 0.5%;
  clear: both;
  display: block;
  width: 98%;
  background-color: #616161c6;
  height: 1px;
}
.head-1 {
  margin-top: 0%;
  padding: 0%;
  padding-bottom: 1%;
  font-style: italic;
}
.billing-rules {
  height: auto;
}
.billing-row-item {
  text-align: center;
  padding: 2%;
  padding-bottom: 0%;
  margin-bottom: 0%;
  vertical-align: middle;
}
.view-button {
  background-color: rgba(175, 240, 150, 0.216);
  color: #8bc34a;
  border: #8bc34a;
}
.alert-msg {
  background-color: #f7d1d1;
  outline: auto red;
  outline-style: dashed;
  margin-top: 2%;
  margin-left: 1%;
  margin-right: 1%;
  max-height: 24px;
  width: 200px;
  text-align: center;
}
.action-btn {
  background-color: #082682;
  color: white !important;
  margin-left: 2%;
}
.title-card {
  font-weight: 900;
  font-size: 200%;
}
</style>
