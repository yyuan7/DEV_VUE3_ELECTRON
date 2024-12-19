<!-- TODO: select all should only select all on the current page -->
<!-- The Download function will be implemented later -->

<template>
  <div>
    <v-card title="UPC Search Results:" flat>
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
              placeholder="e.g. Raspberry Green Tea"
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
              style="max-width: 315px"
              variant="outlined"
              @click="fetchSuggestionsManufacturer"
            />
            <!-- material -->
            <v-select
              v-model="formData.material"
              :bg-color="'white'"
              class="text-box pl-4"
              :items="Object.values(MaterialType)"
              :placeholder="'Select Material'"
              return-object
              style="max-width: 315px"
              variant="outlined"
            ></v-select>
            <!-- download selected UPCs -->
            <v-btn
              class="me-4 justify-end ml-auto"
              icon="mdi-download"
              density="comfortable"
              style="background-color: transparent"
              flat
            />
            <!-- search -->
            <v-btn class="mr-2" color="#0a762b" @click="search">Search</v-btn>
          </v-row>
          <!-- bevType + volume range + last scanned range + complete + edit + ToDo -->
          <v-row class="mb-0 pb-0" style="max-height: 9vh">
            <!-- beverage type -->
            <v-select
              v-model="formData.beverageType"
              :bg-color="'white'"
              class="pb-8 text-box pl-4"
              :items="Object.values(BeverageType)"
              :placeholder="'Select Beverage Type'"
              return-object
              style="min-width: 200px"
              variant="outlined"
            ></v-select>
            <!-- volume range -->
            <v-card-text class="justify-center search-field-title mr-0 pr-0">Volume: </v-card-text>
            <v-text-field
              v-model="formData.volumeMin"
              :rules="volumeRules"
              :bg-color="'white'"
              class="align-center text-box rounded-lg ma-0 pa-0 pt-2"
              density="compact"
              style="max-width: 65px"
              variant="outlined"
              type="tel"
            />
            <v-card-text class="justify-center"> - </v-card-text>
            <v-text-field
              v-model="formData.volumeMax"
              :rules="volumeRules"
              :bg-color="'white'"
              class="align-center text-box rounded-lg ma-0 pa-0 pt-2"
              density="compact"
              style="max-width: 65px"
              variant="outlined"
              type="tel"
            />
            <v-card-text class="justify-center"> oz. </v-card-text>
            <!-- last scanned date range -->
            <v-card-text class="pb-0 mb-3 mt-0 pt-0" style="font-size: 120%; max-width: 315px"
              >Last Scanned:</v-card-text
            >
            <v-date-input
              v-model="formData.scanDateMin"
              :rules="dateRules"
              :min="minDate"
              :bg-color="'white'"
              clearable
              density="compact"
              style="max-width: 200px; max-height: 8vh"
              variant="outlined"
              @click:clear="formData.scanDateMin = null"
            ></v-date-input>
            <v-card-text class="justify-center me-0 pe-2" style="max-width: fit-content">
              -
            </v-card-text>
            <v-date-input
              v-model="formData.scanDateMax"
              :rules="dateRules"
              :min="formData.scanDateMin"
              :max="new Date().toISOString().split('T')[0]"
              :bg-color="'white'"
              clearable
              style="max-width: 200px; max-height: 8vh"
              variant="outlined"
              @click:clear="formData.scanDateMax = null"
            ></v-date-input>
            <!-- complete upc only -->
            <v-checkbox v-model="formData.completeUPCInfo">
              <template #label>
                <span class="testing text">Complete UPCs Only</span>
              </template>
            </v-checkbox>
            <!-- edit selected UPCs -->
            <v-btn class="me-4" color="#0a762b" @click="edit">Edit</v-btn>
            <!-- add selected UPCs into ToDo list -->
            <v-btn class="me-4" color="#0a762b" prepend-icon="mdi-plus" @click="addSelectedToTODO"
              >ToDo</v-btn
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
                  'Name',
                  'Manufacturer',
                  'Material',
                  'Type',
                  'Volume',
                  'Last Scanned',
                  'Count'
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
            <tr
              :class="index % 2 === 0 ? 'even-row' : 'odd-row'"
              @dblclick="dashboard(item.upcCode)"
            >
              <td>
                <v-checkbox v-model="selected" :value="item.upcCode" hide-details inset />
              </td>
              <td
                v-for="field in [
                  item.upcCode,
                  item.name,
                  item.manufacturer,
                  item.material,
                  item.beverageType,
                  item.volumeSize,
                  item.lastScanDate,
                  item.totalScanUnit
                ]"
                :key="field"
                class="upc-data"
              >
                {{ field }}</td
              >
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </v-card>

    <v-dialog v-model="noSuchUPCDialog" max-width="500">
      <v-card>
        <v-card-text>
          UPC '{{ formData.upcCode }}' has not been scanned. Add to database?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn variant="text" text="Add to To-Do" @click="addEmptyUpcToDo" />
          <v-btn color="primary" variant="text" text="Add UPC" @click="addEmptyUpc" />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="noResultDialog" max-width="500">
      <v-card>
        <v-card-text> No UPCs found. </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="text"
            text="Search again"
            @click="noResultDialog = false"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cloneDeep, debounce } from 'lodash-es'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
import { useTagsViewStore } from '@/renderer/store/modules/tagStore'
import { getUpcList } from '@/renderer/api/upc'
import { UpcData, ReqReadUpcTable } from '@/renderer/api/upc/type'
import { getCompanyList } from '@/renderer/api/admin/general'
import { Company } from '@/renderer/api/admin/general/type'
import { defaultSettings } from '@/renderer/config/layout'
import { BeverageType, MaterialType, minDate } from '@/renderer/constants/upc'
import { defaultPaginationData, suggestPaginationData } from '@/renderer/constants/pagination'
import { tableHeaderColor } from '@/renderer/utils/stateColorGetter'
import { addToDoItem } from '@/renderer/api/upc-lists'
import { useUserStore } from '@/renderer/store/modules/userStore'

const router = useRouter()
const route: any = useRoute()
const snackbarStore = useSnackbarStore()
const tagsViewStore = useTagsViewStore()
const items = ref<UpcData[]>([])
const isLoading = ref(false)
const noSuchUPCDialog = ref<boolean>(false)
const noResultDialog = ref(false)

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
  isLoadingName.value = true
  try {
    const responseUpc = await getUpcList({
      currentPage: suggestPaginationData.currentPage,
      size: suggestPaginationData.pageSize,
      totalPages: suggestPaginationData.totalPages,
      name: inputName.value
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

// #region Material //  #endregion
// #region Beverage Type //  #endregion

// #region Volume Range
// Validation - volume range: min > 0 && min < max
const volumeRules = ref([
  (v: number | null) => {
    // Handle non-negative numbers and scientific notation
    if (v && (v < 0 || isNaN(v))) return 'Volume must be a valid positive number'

    if (
      formData.value.volumeMin &&
      formData.value.volumeMax &&
      formData.value.volumeMin > formData.value.volumeMax
    )
      return 'Invalid range'

    return true
  }
])
//  #endregion

// #region Last Scanned Date Range
// Validation - last-scanned date range: within 2 years; both empty or both filled?
const dateRules = ref([
  // (v: string | null) =>
  // {
  // if ((formData.value.scanDateMin && !formData.value.scanDateMax) || (!formData.value.scanDateMin && formData.value.scanDateMax)) {
  //   return 'Both dates must be filled or both empty';
  // }
  // return true;
  // },
  // (v: string | null) => {
  //   // Ensure min date is not after max date
  //   if (formData.value.scanDateMin && formData.value.scanDateMax && formData.value.scanDateMin > formData.value.scanDateMax) {
  //     return 'Start date must be before end date';
  //   }
  //   return true;
  // }
])
//  #endregion

// #region Complete UPC Only //  #endregion

// #region Search Result Table
const selected = ref<string[]>([])
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
  ...searchParams.value
}
// Step 3: bind all inputs to formData
const formData = ref<ReqReadUpcTable>(cloneDeep(combinedFormData))
// Step 4: search based on formData
const search = async () => {
  isLoading.value = true
  try {
    // console.log(formData.value)
    const response = await getUpcList(formData.value)

    items.value = response.data.list

    /*
    need a second search to take place if we are searching for a upc with exactly 13 digits
    if there are < 13 digits, then no results popup. otherwise run search!
    */
    if (response.data.count === 0) {
      if (formData.value.upcCode?.length === 13 && true)
        noSuchUPCDialog.value = true // replace the "&& true" with the secondary db search!
      else noResultDialog.value = true
    }

    // console.log('Search response:', items.value)
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
    if (items.value) selected.value = items.value.map((item) => item.upcCode)
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
    handleRoute('edit/' + item)
  })
}

// watch(selected, (newValue) => {
//   console.log(selected.value)
// })
//  #endregion

// #region Dashboard Function
const dashboard = (item) => {
  handleRoute(item)
}
//  #endregion

// #region Empty Search Results
const closeDialog = () => {
  noSuchUPCDialog.value = false
}

const addEmptyUpcToDo = () => {
  closeDialog()
}

const addEmptyUpc = () => {
  closeDialog()
  router.push({
    path: `/upc/add/${formData.value.upcCode}`
  })
}
//  #endregion

const userStore = useUserStore()
const addSelectedToTODO = () => {
  selected.value.forEach((upc) => {
    addToDoItem({
      upcCode: upc,
      state: '',
      userID: userStore.userId,
      status: true
    })
  })
  selected.value = []
}
</script>

<style lang="scss" scoped>
@import '@/renderer/styles/lowAdmin.css';
@import '@/renderer/styles/billing.css';
</style>
