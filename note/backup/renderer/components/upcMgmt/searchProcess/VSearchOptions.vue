<script setup lang="ts">
import { ref, watch, defineEmits, defineExpose } from 'vue'
import { ReqSearchUpc, UpcData } from '@/renderer/api/upc/type'
import { cloneDeep, debounce } from 'lodash-es'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
import { getUpcList } from '@/renderer/api/upc'
import { suggestPaginationData } from '@/renderer/constants/pagination'

// Define event: updateSearchData
const emit = defineEmits<{
  (e: 'updateSearchData', formData: ReqSearchUpc): void
}>()

// #region Default Data + UPC Code Validation
const DEFAULT_FORM_DATA: ReqSearchUpc = {
  upcCode: '',
  name: undefined
}

const formData = ref<ReqSearchUpc>(cloneDeep(DEFAULT_FORM_DATA))

const upcCodeRules = ref([
  // (v: string) => !!v || 'upcCode is required',
  (v: string) => (v && v.length <= 13) || 'UPC must not exceed 13 digits'
])
//  #endregion

// #region Auto-Prompt UPC Product Name
const snackbarStore = useSnackbarStore()
const input = ref('')
const suggestion = ref<string[]>([])
const isLoading = ref(false)

const fetchsuggestion = async () => {
  isLoading.value = true
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
    isLoading.value = false
    formData.value.name = input.value
  }
}

const debouncedFetchsuggestion = debounce(fetchsuggestion, 300)

watch(input, (newValue) => {
  debouncedFetchsuggestion()
})
//  #endregion

// Emit formData to parent component
const updateParentFormData = () => {
  emit('updateSearchData', formData.value)
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
    <v-card-title class="mt-0 pt-0 pb-4 title">Search By:</v-card-title>
    <v-form :model="formData">
      <v-row>
        <v-card-text class="text pl-8">UPC Code:</v-card-text>
        <v-text-field
          v-model="formData.upcCode"
          :bg-color="'white'"
          class="align-center text-box rounded-lg ma-0 pa-0 pt-2"
          clearable
          placeholder="e.g. *98847"
          style="max-width: 250px"
          variant="outlined"
          :rules="upcCodeRules"
        ></v-text-field>

        <v-card-text class="text justify-center pl-8 ml-16">Product Name:</v-card-text>
        <v-autocomplete
          v-model="formData.name"
          v-model:search="input"
          :items="suggestion"
          :loading="isLoading"
          :bg-color="'white'"
          class="align-center text-box rounded-lg ma-0 pa-0 pt-2"
          placeholder="e.g. Raspberry Green Tea"
          clearable
          style="max-width: 400px"
          variant="outlined"
          @click="fetchsuggestion"
        ></v-autocomplete>
      </v-row>
    </v-form>
  </v-container>
</template>
