<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cloneDeep, debounce } from 'lodash-es'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
import { useTagsViewStore } from '@/renderer/store/modules/tagStore'
import { addUpcInfo, getUpcInfo, getUpcList } from '@/renderer/api/upc'
import { UpcData, ReqReadUpcTable } from '@/renderer/api/upc/type'
import { PopulatedToDoItem, ReqReadToDoTable, ToDoItem } from '@/renderer/api/upc-lists/type'
import { getCompanyList } from '@/renderer/api/admin/general'
import { Company } from '@/renderer/api/admin/general/type'
import { defaultSettings } from '@/renderer/config/layout'
import { StateType, Status, TimeRange } from '@/renderer/constants/upc'
import { defaultPaginationData, suggestPaginationData } from '@/renderer/constants/pagination'
import {
  backgroundColor,
  stateButtonColor,
  tableHeaderColor
} from '@/renderer/utils/stateColorGetter'
import { UPC } from '@/renderer/api/billing/type'
import { addToDoItem, getToDoList, removeToDoItem } from '@/renderer/api/upc-lists'
import { useUserStore } from '@/renderer/store/modules/userStore'

const router = useRouter()
const route: any = useRoute()
const snackbarStore = useSnackbarStore()
const tagsViewStore = useTagsViewStore()
const items = ref<PopulatedToDoItem[]>([])
const isLoading = ref(false)
const addUPCDialog = ref<boolean>(false)
const noResultDialog = ref(false)
const userStore = useUserStore()

// #region UPC Code
const upcCodeRules = ref([
  // (v: string) => !!v || 'upcCode is required',
  (v: string) => !v || (v && v.length <= 13) || 'UPC must not exceed 13 digits'
])
//  #endregion

// #region Product Name
const inputName = ref('')
const suggestionName = ref<string[]>([])
const isLoadingName = ref(false)

const fetchsuggestionName = async () => {
  /*
  isLoadingName.value = true
  try {
    const responseUpc = await getUpcList({
      currentPage: suggestPaginationData.currentPage,
      size: suggestPaginationData.pageSize,
      totalPages: suggestPaginationData.totalPages,
      name: inputName.value,
      state: '',
      type: 'Manufacturer'
    })
    suggestionName.value = [
      ...new Set(
        responseUpc.data.list
          .map((upc: UpcData) => upc.name)
          .filter((name): name is string => name !== undefined)
      )
    ]
  } catch (error) {
    snackbarStore.showErrorMessage(`Fetching Error: ${error}`)
  } finally {
    isLoadingName.value = false
    formData.value.name = inputName.value
  }
    */
}

const debouncedFetchsuggestionName = debounce(fetchsuggestionName, 300)

watch(inputName, (newValue) => {
  debouncedFetchsuggestionName()
})
//  #endregion

// #region Manufacturer
const inputManufacturer = ref('')
const suggestionManufacturer = ref<string[]>([])
const isLoadingManufacturer = ref(false)

const fetchSuggestionsManufacturer = async () => {
  isLoading.value = true
  try {
    const response = await getCompanyList({
      currentPage: suggestPaginationData.currentPage,
      size: suggestPaginationData.pageSize,
      totalPages: suggestPaginationData.totalPages,
      name: inputManufacturer.value,
      state: '',
      type: 'Manufacturer'
    })
    suggestionManufacturer.value = [
      ...new Set(response.data.list.map((manufacturer: Company) => manufacturer.name))
    ]
  } catch (error) {
    snackbarStore.showErrorMessage(`Fetching Error: ${error}`)
  } finally {
    isLoadingManufacturer.value = false
    formData.value.manufacturer = inputManufacturer.value
  }
}
const debouncedFetchSuggestionsManufacturer = debounce(fetchSuggestionsManufacturer, 300)

watch(inputManufacturer, (newValue) => {
  debouncedFetchSuggestionsManufacturer()
})
//  #endregion

// #region Search Result Table
const selected = ref<PopulatedToDoItem[]>([])
const selectAll = ref(false)

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
  userid: userStore.userId,
  ...searchParams.value
}
// Step 3: bind all inputs to formData
const formData = ref<ReqReadToDoTable>(cloneDeep(combinedFormData))
// Step 4: search based on formData
const search = async () => {
  isLoading.value = true
  try {
    const response = await getToDoList(formData.value)
    items.value = response.data.list
  } catch (error) {
    snackbarStore.showErrorMessage(`Search Error: ${error}`)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  search()
})
//  #endregion

// #region Search Result Table Style
const toggleSelectAll = () => {
  if (selectAll.value) {
    // Select all items on the current page
    if (items.value) selected.value = items.value
  } else {
    // Deselect all items
    selected.value = []
  }
}
//  #endregion

// #region Download Function //  #endregion

// #region Edit Function
const handleRoute = (path: string): void => {
  router.push(basePath + path)
}
const basePath = '/upc/'
const edit = () => {
  selected.value.forEach((item) => {
    handleRoute('edit/' + item.upc.upcCode)
  })
}

// #region Dashboard Function
const dashboard = (code) => {
  console.log(code)
  handleRoute(code)
}
//  #endregion

const getProdInfoColor = (item: UpcData) => {
  if (item.completeUPCInfo) return 'complete'
  let partial = false
  Object.values(item).forEach((field) => {
    if (!field) partial = true
  })
  return partial ? 'partial' : 'missing'
}

const getBillingInfoColor = (item: PopulatedToDoItem) => {
  if (item.billingRuleCount && item.billingRuleCount === item.expectedTotal) return 'complete'
  else if (item.billingRuleCount !== '' && parseInt(item.billingRuleCount) !== 0) return 'partial'
  else if (parseInt(item.billingRuleCount) === 0) return 'missing'
}

const getBillingInfoData = (item: PopulatedToDoItem) => {
  if (parseInt(item.expectedTotal)) return item.billingRuleCount + '/' + item.expectedTotal
  return '-'
}

const viewRules = () => {
  console.log(selected.value)
  try {
    router.push({
      name: 'BR-Result',
      query: {
        combinedFormData: JSON.stringify({ upcs: selected.value?.map((item) => item.upc.upcCode) })
      }
    })
  } catch (error) {
    snackbarStore.showErrorMessage(`Search Error: ${error}`)
  }
}

const markDone = () => {
  selected.value.forEach((item) => {
    const toRemove = { ...item, upcCode: item.upc.upcCode, userID: item.userID.toString() }
    const test = removeToDoItem(toRemove)
  })
  selected.value = []
  search()
}

const addRules = (code: string, state: string) => {
  try {
    router.push({
      name: 'BR-Add',
      query: {
        state: state,
        upcs: JSON.stringify({ upcs: [code] })
      }
    })
  } catch (error) {
    snackbarStore.showErrorMessage(`Search Error: ${error}`)
  }
  // navigate to BR add page with this UPC and state!
  console.log('adding rules for ', code, 'in', state)
}

// #region new-upc

const newUpcText = ref<string>('')
const newUPCExists = ref<boolean>(false)
const upcToAdd = ref<string>()
const checkNewUPC = async () => {
  const result = await getUpcInfo(newUpcText.value)
  if (result.data.message) {
    newUPCExists.value = false
    upcToAdd.value = newUpcText.value
    console.log('no upc found!')
  } else if (result.data) {
    newUPCExists.value = true
    upcToAdd.value = result.data.list[0].upcCode
    console.log(upcToAdd.value)
  } else {
    console.log('something went wrong!!!')
  }
}

const addtoToDo = () => {
  if (!upcToAdd.value) return
  const newToDoItem: ToDoItem = {
    upcCode: upcToAdd.value,
    state: '',
    userID: userStore.userId,
    status: true
  }
  const test = addToDoItem(newToDoItem)
  console.log(test)
  addUPCDialog.value = false
}

const addNewUPC = () => {
  if (!upcToAdd.value) {
    console.warn('Add to database failed.')
    return
  }
  // add a new UPC with no current data
  addUpcInfo({ upcCode: upcToAdd.value })
  // and then add that record to the to-do list
  addtoToDo()
}
// #endregion

formData.value.timeRange = TimeRange.SixMonths
</script>

<template>
  <div>
    <v-card title="To-Do List:" flat>
      <v-card class="search-wrapper border-sm">
        <v-form ref="searchFormRef" :loading="isLoading" class="mx-2 pt-2">
          <!-- upcCode + name + manufacturer + material + download + search -->
          <v-row class="mx-0 mt-0">
            <!-- upcCode -->
            <v-text-field
              v-model="formData.upcCode"
              :bg-color="'white'"
              class="align-center text-box rounded-lg ma-0 pa-0"
              clearable
              placeholder="Search by UPC Code"
              style="max-width: 250px"
              variant="outlined"
              :rules="upcCodeRules"
            />
            <!-- name -->
            <v-autocomplete
              v-model="formData.name"
              v-model:search="inputName"
              :items="suggestionName"
              :loading="isLoadingName"
              :bg-color="'white'"
              class="align-center text-box rounded-lg ma-0 pa-0"
              placeholder="Search by Product Name"
              clearable
              clear-on-select
              style="max-width: 400px"
              variant="outlined"
              @click="fetchsuggestionName"
            />
            <!-- manufacturer -->
            <v-autocomplete
              v-model="formData.manufacturer"
              v-model:search="inputManufacturer"
              :items="suggestionManufacturer"
              :loading="isLoadingManufacturer"
              :bg-color="'white'"
              class="text-box pl-4 mb-0 pb-0"
              placeholder="Select Manufacturer"
              clearable
              clear-on-select
              :no-data-text="'Start typing for suggestions'"
              style="max-width: 315px"
              variant="outlined"
              @click="fetchSuggestionsManufacturer"
            />
            <!-- download selected UPCs -->
            <v-btn
              class="me-4 justify-end ml-auto"
              icon="mdi-download"
              density="comfortable"
              style="background-color: transparent"
              flat
            />
            <!-- search -->
            <v-btn class="me-4" prepend-icon="mdi-magnify" @click="search" color="#0a762b"
              >search</v-btn
            >
            <!-- add -->
            <v-btn
              class="me-4"
              prepend-icon="mdi-plus"
              @click="
                () => {
                  addUPCDialog = true
                  newUPCExists = false
                  newUpcText = ''
                  upcToAdd = undefined
                }
              "
              color="#0a762b"
              >add</v-btn
            >
          </v-row>
          <!-- bevType + volume range + last scanned range + complete + edit + ToDo -->
          <v-row class="mb-0 pb-0" style="max-height: 9vh">
            <!-- product status -->
            <v-select
              v-model="formData.prodStatus"
              :bg-color="'white'"
              class="pb-8 text-box pl-4"
              :items="Object.values(Status)"
              :placeholder="'Select Product Status'"
              return-object
              clearable
              style="max-width: 315px"
              variant="outlined"
            ></v-select>
            <!-- billing status -->
            <v-select
              v-model="formData.billingStatus"
              :bg-color="'white'"
              class="pb-8 text-box pl-4"
              :items="Object.values(Status)"
              :placeholder="'Select Billing Status'"
              return-object
              clearable
              style="max-width: 315px"
              variant="outlined"
            ></v-select>
            <!-- time range -->
            <v-select
              v-model="formData.timeRange"
              :bg-color="'white'"
              class="pb-8 text-box pl-4"
              :items="Object.values(TimeRange)"
              :placeholder="'Select Billing Status'"
              return-object
              style="max-width: 315px"
              variant="outlined"
            ></v-select>
            <!-- states -->
            <v-select
              v-model="formData.state"
              :bg-color="'white'"
              class="pb-8 text-box pl-4"
              :items="Object.values(StateType)"
              :placeholder="'All States'"
              return-object
              clearable
              style="max-width: 315px"
              variant="outlined"
            ></v-select>
            <!-- view rules -->
            <v-btn
              class="me-4 justify-end ml-auto"
              @click="viewRules"
              :disabled="selected.length === 0"
              color="#0a762b"
              >View Rules</v-btn
            >
            <!-- edit upcs list -->
            <v-btn
              class="me-4"
              prepend-icon="mdi-pencil"
              @click="edit"
              color="#0a762b"
              :disabled="selected.length === 0"
              >edit</v-btn
            >
            <!-- mark done -->
            <v-btn
              class="me-4"
              prepend-icon="mdi-check-bold"
              @click="markDone"
              color="#0a762b"
              :disabled="selected.length === 0"
              >done</v-btn
            >
          </v-row>
        </v-form>
      </v-card>
      <v-card class="border-sm table-wrapper">
        <v-data-table
          v-model="selected"
          :items="items"
          show-select
          item-value="upcCode"
          item-key="upcCode"
          class="elevation-1 ma-2"
          style="max-width: 99%"
        >
          <!-- Table Headers -->
          <template #headers>
            <tr>
              <th class="upc-header" :style="{ backgroundColor: tableHeaderColor('Maine') }">
                <v-checkbox
                  v-model="selectAll"
                  :indeterminate="selected.length > 0 && selected.length < items.length"
                  hide-details
                  inset
                  @change="toggleSelectAll"
                />
              </th>
              <th
                v-for="title in [
                  'UPC Code',
                  'Product Name',
                  'Manufacturer',
                  'State',
                  'Product Information',
                  'Billing Rules',
                  'Units in State',
                  'First-Scan Date',
                  'Last-Scan Date',
                  ''
                ]"
                :key="title"
                class="upc-header"
                :style="{ backgroundColor: tableHeaderColor('Maine') }"
                style="font-weight: bold; text-align: center; font-size: 125%"
                >{{ title }}</th
              >
            </tr>
          </template>

          <!-- Table Content -->
          <template #item="{ item, index }">
            <tr @dblclick="dashboard(item.upc.upcCode)" :class="index % 2 === 1 ? 'even-row' : ''">
              <td>
                <v-checkbox v-model="selected" :value="item" hide-details inset />
              </td>
              <td
                v-for="(field, index) in [
                  item.upc.upcCode,
                  item.upc.name,
                  item.upc.manufacturer,
                  item.state ? item.state : '-'
                ]"
                :key="index"
                class="list-data"
              >
                {{ field }}</td
              >
              <td class="list-data" :class="getProdInfoColor(item.upc) + '-data'">
                {{ getProdInfoColor(item.upc) }}</td
              >
              <td class="list-data" :class="getBillingInfoColor(item) + '-data'">
                {{ getBillingInfoData(item) }}</td
              >
              <td
                v-for="(field, index) in [
                  item.upc.totalScanUnit,
                  item.upc.firstScanDate,
                  item.upc.lastScanDate
                ]"
                :key="index"
                class="list-data"
              >
                {{ field }}</td
              >
              <td class="ma-0 pa-0 px-2">
                <v-btn
                  class="pa-0 px-2"
                  v-if="getProdInfoColor(item.upc) === 'complete'"
                  prepend-icon="mdi-plus"
                  size="small"
                  style="font-size: 75%"
                  @click="addRules(item.upc.upcCode, item.state)"
                >
                  rules
                </v-btn></td
              >
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </v-card>

    <v-dialog v-model="addUPCDialog" max-width="400">
      <v-card class="text-center">
        <v-card-title class="mb-0 pb-0" style="font-weight: bold; font-size: 160%"
          >Add to To Do:</v-card-title
        >
        <v-card-text class="mt-0"> Enter a known or unknown UPC code: </v-card-text>
        <v-row class="justify-center">
          <v-text-field
            v-model="newUpcText"
            type="tel"
            :rules="[(v) => (!!v && v.length === 12) || 'Invalid UPC']"
            class="ma-0 pa-0"
            variant="outlined"
            density="compact"
            style="max-width: 180px"
            @input="
              () => {
                newUPCExists = false
                upcToAdd = undefined
              }
            "
          />
          <v-btn
            :disabled="!(!!newUpcText && newUpcText.length === 12)"
            class="ml-6"
            style="color: white"
            :style="{ backgroundColor: stateButtonColor('Maine') }"
            @click="checkNewUPC"
            >enter</v-btn
          >
        </v-row>
        <v-card-text class="ma-0 pa-0 justify-start" v-if="upcToAdd">{{
          newUPCExists
            ? 'UPC found in database! Add to to-do list?'
            : 'UPC valid! Add to database and to-do?'
        }}</v-card-text>
        <v-row class="justify-center mb-4 mt-4">
          <v-btn class="mr-4" variant="outlined" text="Cancel" @click="addUPCDialog = false" />
          <v-btn
            class="mr-4"
            v-if="newUPCExists"
            :text="'View Record'"
            style="color: white"
            :style="{ backgroundColor: stateButtonColor('Maine') }"
            @click="dashboard(upcToAdd)"
          />
          <v-btn
            :text="'Add'"
            style="color: white"
            :style="{ backgroundColor: stateButtonColor('Maine') }"
            :disabled="!upcToAdd"
            @click="newUPCExists ? addtoToDo() : addNewUPC()"
          />
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
@import '@/renderer/styles/lowAdmin.css';
@import '@/renderer/styles/billing.css';
.complete-data {
  background-color: #e1ffdd;
}
.missing-data {
  background-color: #fce0e0;
}
.partial-data {
  background-color: #fbfce4;
}
</style>
