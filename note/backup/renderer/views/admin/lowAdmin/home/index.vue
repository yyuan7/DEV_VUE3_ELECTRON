<!-- TODO: select all should only select all on the current page -->
<!-- The Download function will be implemented later -->

<template>
  <div>
    <v-card flat>
      <v-row>
        <v-card-title>
          Manage {{ type }}
        </v-card-title>
        <StatePicker :btn-needed="true" :initial="activeState" @select-state="loadState" />
      </v-row>
      <v-card class="search-wrapper border-sm">
        <v-form ref="searchFormRef" :loading="isLoading">
          <v-row>
            <!-- fetch name -->
            <v-autocomplete
              v-model="formData.name"
              v-model:search="inputName"
              :items="suggestionName"
              :loading="isLoadingName"
              :bg-color="'white'"
              class="text-box pl-4 mb-0 pb-0"
              placeholder="Select Manufacturer"
              clearable
              clear-on-select
              style="max-width: 315px"
              variant="outlined"
              @click="fetchsuggestionName"
            />
            <!-- visible type -->
            <v-select
              v-model="selectedVisibleOption"
              :items="visibleOptions"
              item-title="text"
              item-value="value"
              :bg-color="'white'"
              class="pb-8 text-box pl-4"
              :placeholder="'Select Visibility'"
              return-object
              style="max-width: 315px"
              variant="outlined"
            />
            <!-- active billing rules only -->
            <v-checkbox v-model="formData.noActiveRulesOnly">
              <template #label>
                <span class="testing text">{{ type }} with NO active billing rules ONLY</span>
              </template>
            </v-checkbox>
            <!-- download selected UPCs -->
            <v-btn
              class="me-4 ml-4"
              icon="mdi-download"
              density="comfortable"
              style="background-color: transparent"
              flat
            />
            <!-- search -->
            <v-btn class="me-4" color="#0a762b" @click="search">Search</v-btn>
            <!-- edit selected UPCs -->
            <v-btn class="me-4" color="#0a762b" @click="edit">Edit</v-btn>
            <!-- add selected UPCs into ToDo list -->
            <v-btn class="me-4" color="#0a762b" @click="add">+Add</v-btn>
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
          class="elevation-1"
        >
          <!-- Table Headers -->
          <template #headers>
            <tr>
              <th>
                <v-checkbox
                  v-model="selectAll"
                  :indeterminate="selected.length > 0 && selected.length < items.length"
                  hide-details
                  inset
                  @change="toggleSelectAll"
                />
              </th>
              <th>Visible</th>
              <th>Name</th>
              <th>Primary Contact Name</th>
              <th>Primary Contact Phone</th>
              <th>Secondary Contact Name</th>
              <th>Secondary Contact Phone</th>
              <th>Last Updated</th>
            </tr>
          </template>

          <!-- Table Content -->
          <template #item="{ item }">
            <tr @dblclick="dashboard(item.id)">
              <td>
                <v-checkbox v-model="selected" :value="item.id" hide-details inset />
              </td>
              <td>{{ item.visible }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.primaryContact?.name }}</td>
              <td>{{ item.primaryContact?.phone }}</td>
              <td>{{ item.secondaryContact ? item.secondaryContact[0].name : '-' }}</td>
              <td>{{ item.secondaryContact ? item.secondaryContact[0].phone : '-' }}</td>
              <td>{{ item.lastUpdatedDate }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cloneDeep, debounce } from 'lodash-es'
import { getCompanyList } from '@/renderer/api/admin/general'
import { Company, ReqReadCompanyTable } from '@/renderer/api/admin/general/type'
import { titleCapitalize } from '@/renderer/utils/formatting'
import { defaultPaginationData, suggestPaginationData } from '@/renderer/constants/pagination'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
import StatePicker from '@/renderer/components/common/VStatePicker.vue'

const route = useRoute()
const router = useRouter()
// Identify manufacturer / distributor / initiator / pickup agents
const basePath = route.params.action || route.path.split('/')[1]
const type = titleCapitalize(basePath)
const snackbarStore = useSnackbarStore()

// #region Fetch States
const activeState = ref((route.query.state as string) || '')
const loadState = (state: string) => {
  activeState.value = state
}

watch(activeState, (newVal) => {
  formData.value.state = newVal
})
//  #endregion

// #region Fetch Company
const inputName = ref('')
const suggestionName = ref<string[]>([])
const isLoadingName = ref(false)

const fetchsuggestionName = async () => {
  isLoadingName.value = true
  try {
    const responseCompany = await getCompanyList({
      currentPage: suggestPaginationData.currentPage,
      size: suggestPaginationData.pageSize,
      totalPages: suggestPaginationData.totalPages,
      name: inputName.value,
      state: activeState.value,
      type
    })
    suggestionName.value = [
      ...new Set(responseCompany.data.list.map((company: Company) => company.name))
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

// #region Search
// Search Field
const selectedVisibleOption = ref({ text: 'Visible Only', value: true })
const visibleOptions = [
  { text: 'Visible Only', value: true },
  { text: 'Invisible Only', value: false },
  { text: 'All', value: null }
]

// Search Function
const items = ref<Company[]>([])
const isLoading = ref(false)

// Step 1: default search params
const formData = ref<ReqReadCompanyTable>({
  visible: selectedVisibleOption.value.value,
  currentPage: defaultPaginationData.currentPage,
  size: defaultPaginationData.pageSize,
  totalPages: defaultPaginationData.totalPages,
  state: activeState.value,
  type
})

// Step 2: monitor selectedVisibleOption and update formData accordingly
watch(selectedVisibleOption, (newVal) => {
  formData.value.visible = newVal.value
})

// Step 3: search based on formData
const search = async () => {
  isLoading.value = true
  try {
    const response = await getCompanyList(formData.value)
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

// #region Result Table
const selected = ref<string[]>([])
const selectAll = ref(false)

const toggleSelectAll = () => {
  if (selectAll.value) {
    // Select all items on the current page
    if (items.value) selected.value = items.value.map((item) => item.id)
  } else {
    // Deselect all items
    selected.value = []
  }
}
//  #endregion

// #region Add & Edit & Dashboard
const handleRoute = (path: string): void => {
  router.push({
    path: '/' + basePath + '/' + path,
    query: { state: activeState.value }
  })
}
const edit = () => {
  selected.value.forEach((item) => {
    handleRoute(item + '/edit')
  })
}

const add = () =>
  router.push({
    path: 'add',
    query: { state: activeState.value }
  })

const dashboard = (item) => handleRoute(item)
//  #endregion
</script>

<style lang="scss" scoped></style>
