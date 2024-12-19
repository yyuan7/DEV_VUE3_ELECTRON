<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cloneDeep, debounce } from 'lodash-es'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
import { useTagsViewStore } from '@/renderer/store/modules/tagStore'
import { getUnknownUpcList, getUpcList } from '@/renderer/api/upc'
import { UpcData, ReqReadUnknownUpcTable, PopulatedUPCData } from '@/renderer/api/upc/type'
// import { getManufacturerList } from '@/renderer/api/admin/general/manufacturer'
import { getCompanyList } from '@/renderer/api/admin/general'
import { Company } from '@/renderer/api/admin/general/type'
import { StateType, minDate, Status, TimeRange, SimpleStatus } from '@/renderer/constants/upc'
import { defaultPaginationData, suggestPaginationData } from '@/renderer/constants/pagination'
import { tableHeaderColor, backgroundColor } from '@/renderer/utils/stateColorGetter'
import { addToDoItem } from '@/renderer/api/upc-lists'
import { useUserStore } from '@/renderer/store/modules/userStore'

const router = useRouter()
const route: any = useRoute()
const snackbarStore = useSnackbarStore()
const tagsViewStore = useTagsViewStore()
const items = ref<PopulatedUPCData[]>([])
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

// #region Search Result Table
const selected = ref<PopulatedUPCData[]>([])
const selectAll = ref(false)

const combinedFormData = {
  currentPage: defaultPaginationData.currentPage,
  size: defaultPaginationData.pageSize,
  totalPages: defaultPaginationData.totalPages,
  threshold: 5000,
  timeRange: TimeRange.SixMonths,
  unassignedOnly: false,
  populateRules: true,
  nameStatus: SimpleStatus.Complete,
  manuStatus: SimpleStatus.Complete,
  unknownOnly: false,
}
// Step 3: bind all inputs to formData
const formData = ref<ReqReadUnknownUpcTable>(cloneDeep(combinedFormData))
// Step 4: search based on formData
const search = async () => {
  isLoading.value = true
  try {
    const response = await getUnknownUpcList(formData.value)
    items.value = response.data.list
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
    if (items.value) selected.value = items.value.map((item) => item)
  } else {
    // Deselect all items
    selected.value = []
  }
}
//  #endregion

// #region Edit Function
const handleRoute = (path: string): void => {
  router.push(basePath + path)
}
const basePath = '/upc/'

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
      upcCode: upc.upcCode,
      state: upc.appearingState ? upc.appearingState : '',
      userID: userStore.userId,
      status: true
    })
  })
  selected.value = []
}
</script>

<template>
  <v-container
    class="ma-2 container rounded-lg"
    fluid
    :style="{ backgroundColor: backgroundColor('Maine') }"
  >
    <v-row class="d-flex pb-0 mb-0 ml-0" justify="space-between">
      <v-card-title class="page-header mb-0 mt-4">Known Unpaid UPC List</v-card-title>
    </v-row>
    <hr class="hr-style mt-0 mb-3" />
    <v-form ref="searchFormRef" :loading="isLoading" class="mx-2 pt-2 mb-0 pb-0">
      <!-- upcCode + name + manufacturer + material + download + search -->
      <v-row class="mx-0 mt-0 mb-0 pb-0">
        <!-- upcCode -->
        <v-text-field
          class="ml-6 mr-3"
          v-model="formData.upcCode"
          placeholder="Search by UPC"
          :bg-color="'white'"
          variant="outlined"
          hide-details
          style="max-width: 200px"
          clearable
        ></v-text-field>
        <v-text-field
          class="mx-3"
          v-model="formData.name"
          placeholder="Search by Product Name"
          :bg-color="'white'"
          variant="outlined"
          style="max-width: 300px"
          hide-details
          clearable
        ></v-text-field>
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
          hide-details
          style="max-width: 315px"
          variant="outlined"
          @click="fetchSuggestionsManufacturer"
        />
        <!-- units scanned threshold -->
        <v-card-text
          style="max-width: fit-content"
          class="ml-10 mr-0 pr-0 search-field-title mt-4 pt-0"
          >Threshold:</v-card-text
        >
        <v-text-field
          v-model="formData.threshold"
          type="number"
          :bg-color="'white'"
          hide-details
          class="text-box pl-4 mb-0 pb-0"
          variant="outlined"
          style="max-width: 125px"
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
        <v-btn class="mr-2" color="#0a762b" @click="search">Search</v-btn>
      </v-row>
      <v-row class="mb-4 pb-0 ml-3">
        <v-select
          v-model="formData.timeRange"
          :bg-color="'white'"
          class="text-box mx-3"
          :items="Object.values(TimeRange)"
          :placeholder="'All States'"
          return-object
          hide-details
          variant="outlined"
          style="max-width: 200px"
        ></v-select>
        <v-select
          v-model="formData.state"
          :items="Object.values(StateType)"
          return-object
          :placeholder="'All States'"
          class="mx-3"
          hide-details
          style="max-width: 190px"
          :bg-color="'white'"
          variant="outlined"
          clearable
        ></v-select>
        <v-select
          v-model="formData.ruleStatus"
          :items="Object.values(Status)"
          return-object
          :placeholder="'Any Rule Status'"
          class="mx-3"
          hide-details
          style="max-width: 200px"
          :bg-color="'white'"
          variant="outlined"
          clearable
        ></v-select>
        <!-- complete upc only -->
        <v-checkbox
          hide-details
          density="compact"
          v-model="formData.unassignedOnly"
          label="Unassigned UPCs Only"
          class="ml-3 mt-3 pt-0 mb-3"
          style="max-width: 250px; max-height: 7vh"
        />
        <!-- add selected UPCs into ToDo list -->
        <v-btn
          flat
          :disabled="selected.length === 0"
          class="d-flex justify-end ml-auto mr-5 mt-6"
          color="#0a762b"
          prepend-icon="mdi-plus"
          @click="addSelectedToTODO"
          >ToDo</v-btn
        >
      </v-row>
    </v-form>
    <v-data-table
      v-model="selected"
      :items="items"
      show-select
      class="elevation-1 mt-0 pt-0"
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
              'UPC',
              'Product Name',
              'Manufacturer',
              'State',
              'Billing Rules',
              'Units by State',
              'First Scanned',
              'Last Scanned',
              'Assigned To'
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
        <tr :class="index % 2 === 0 ? 'even-row' : 'odd-row'" @dblclick="dashboard(item.upcCode)">
          <td>
            <v-checkbox v-model="selected" :value="item" hide-details inset />
          </td>
          <td
            v-for="field in [
              item.upcCode,
              item.name,
              item.manufacturer,
              item.appearingState,
              item.ruleStatus,
              item.unitsInState,
              item.firstScanDate,
              item.lastScanDate,
              item.assignedTo || '-'
            ]"
            :key="field"
            class="upc-data"
          >
            {{ field }}</td
          >
        </tr>
      </template>
    </v-data-table>

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
  </v-container>
</template>

<style lang="scss" scoped>
@import '@/renderer/styles/lowAdmin.css';
@import '@/renderer/styles/billing.css';
</style>
