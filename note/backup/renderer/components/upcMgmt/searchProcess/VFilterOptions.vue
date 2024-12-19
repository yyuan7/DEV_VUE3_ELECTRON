<script setup lang="ts">
import { ref, watch } from 'vue'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { cloneDeep, debounce } from 'lodash-es'
import { ReqFilterUpc } from '@/renderer/api/upc/type'
import { getCompanyList } from '@/renderer/api/admin/general'
import { Company } from '@/renderer/api/admin/general/type'
import { BeverageType, MaterialType, minDate } from '@/renderer/constants/upc'
import { suggestPaginationData } from '@/renderer/constants/pagination'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'

// Define event: updateFilterhData
const emit = defineEmits<{
  (e: 'updateFilterData', formData: ReqFilterUpc): void
}>()

// #region Default Data
const DEFAULT_FORM_DATA: ReqFilterUpc = {
  manufacturer: undefined,
  material: undefined,
  beverageType: undefined,
  completeUPCInfo: false,
  volumeMin: null,
  volumeMax: null,
  scanDateMin: null,
  scanDateMax: null
}

const formData = ref<ReqFilterUpc>(cloneDeep(DEFAULT_FORM_DATA))
//  #endregion

// #region Auto-Prompt Manufacturer
const snackbarStore = useSnackbarStore()
const input = ref('')
const suggestions = ref<string[]>([])
const isLoading = ref(false)

const fetchSuggestions = async () => {
  isLoading.value = true
  try {
    const response = await getCompanyList({
      currentPage: suggestPaginationData.currentPage,
      size: suggestPaginationData.pageSize,
      totalPages: suggestPaginationData.totalPages,
      name: input.value,
      state: '',
      type: 'manufacturer'
    })
    suggestions.value = [...new Set(response.data.list.map((target: Company) => target.name))]
  } catch (error) {
    snackbarStore.showErrorMessage(`Fetching Error: ${error}`)
  } finally {
    isLoading.value = false
    formData.value.manufacturer = input.value
  }
}
const debouncedFetchSuggestions = debounce(fetchSuggestions, 300)

watch(input, (newValue) => {
  debouncedFetchSuggestions()
})
//  #endregion

// #region Validation Rules
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

// Emit formData to parent component
const updateParentFormData = () => {
  emit('updateFilterData', formData.value)
}

const resetForm = () => {
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
  input.value = ''
}

// Expose methods to the parent
defineExpose({
  updateParentFormData,
  resetForm
})
</script>

<template>
  <v-container class="green-container rounded-xl mb-6">
    <v-card-title class="mt-0 pt-0 title mb-0 pb-0">Filter By:</v-card-title>
    <v-form :model="formData">
      <!-- Filter Manufacturer + Material + Complete UPC -->
      <v-row>
        <v-col style="max-width: 400px">
          <v-card-text class="pb-0 mb-0" style="font-size: 120%; max-width: 315px"
            >Select Manufacturer:</v-card-text
          >
          <v-autocomplete
            v-model="formData.manufacturer"
            v-model:search="input"
            :items="suggestions"
            :loading="isLoading"
            :bg-color="'white'"
            class="text-box pl-4 mb-0 pb-0"
            placeholder="Select Manufacturer"
            clearable
            style="max-width: 315px"
            variant="outlined"
            @click="fetchSuggestions"
          ></v-autocomplete>
        </v-col>
        <v-col style="max-width: 400px">
          <v-card-text
            class="text justify-center pb-0 mb-0"
            style="font-size: 120%; max-width: 315px"
            >Select Material:</v-card-text
          >
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
        </v-col>
        <v-col>
          <v-row class="align-center mt-10">
            <v-checkbox v-model="formData.completeUPCInfo"
              ><template #label>
                <span class="testing text">Complete UPCs Only</span>
              </template>
            </v-checkbox>
          </v-row>
        </v-col>
      </v-row>
      <!-- Filter BevType + Volume Range + Last Scanned Range -->
      <v-row>
        <v-col style="max-width: 400px">
          <v-card-text class="pb-0 mb-0 mt-0 pt-0" style="font-size: 120%; max-width: 315px"
            >Select Beverage Type:</v-card-text
          >
          <v-select
            v-model="formData.beverageType"
            :bg-color="'white'"
            class="pb-8 text-box pl-4"
            :items="Object.values(BeverageType)"
            :placeholder="'Select Beverage Type'"
            return-object
            style="max-width: 315px"
            variant="outlined"
          ></v-select>
        </v-col>
        <v-col class="me-0 pe-16" style="max-width: fit-content">
          <v-card-text class="pb-0 mb-3 mt-0 pt-0" style="font-size: 120%; max-width: 315px"
            >Select Volume Range:</v-card-text
          >
          <v-row class="ml-4" style="max-width: fit-content">
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
          </v-row>
        </v-col>
        <v-col class="ml-6 pl-16 final-col">
          <v-card-text class="pb-0 mb-3 mt-0 pt-0" style="font-size: 120%; max-width: 315px"
            >Last Scanned:</v-card-text
          >
          <v-row>
            <v-date-input
              v-model="formData.scanDateMin"
              :rules="dateRules"
              :min="minDate"
              :bg-color="'white'"
              clearable
              style="max-width: 200px"
              variant="outlined"
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
              style="max-width: 200px"
              variant="outlined"
            ></v-date-input>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
