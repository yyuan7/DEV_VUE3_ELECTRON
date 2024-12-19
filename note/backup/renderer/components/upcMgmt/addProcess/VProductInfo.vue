<script setup lang="ts">
import { ref, watch } from 'vue'
import { debounce } from 'lodash-es'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
import { getCompanyList } from '@/renderer/api/admin/general'
import { Company } from '@/renderer/api/admin/general/type'
import { suggestPaginationData } from '@/renderer/constants/pagination'

// #region Fetch Manufacturer
const snackbarStore = useSnackbarStore()
const input = ref('')
const suggestions = ref<string[]>([])
const isLoading = ref(false)
const suggestionsCache = new Map<string, string[]>()

const fetchSuggestions = async () => {
  const trimmedInput = input.value.trim()
  if (!trimmedInput) {
    suggestions.value = []
    return
  }

  if (suggestionsCache.has(trimmedInput)) {
    suggestions.value = suggestionsCache.get(trimmedInput)!
    return
  }

  isLoading.value = true
  try {
    const response = await getCompanyList({
      currentPage: suggestPaginationData.currentPage,
      size: suggestPaginationData.pageSize,
      totalPages: suggestPaginationData.totalPages,
      name: trimmedInput,
      state: '',
      type: 'Manufacturer'
    })
    const newSuggestions = [
      ...new Set(response.data.list.map((manufacturer: Company) => manufacturer.name))
    ]
    suggestionsCache.set(trimmedInput, newSuggestions)
    suggestions.value = newSuggestions
  } catch (error) {
    console.error('Fetching error:', error)
    snackbarStore.showErrorMessage('Unable to fetch manufacturer suggestions. Please try again.')
  } finally {
    isLoading.value = false
    manufacturer.value = input.value
  }
}

const debouncedFetchSuggestions = debounce(fetchSuggestions, 300)

watch(input, () => {
  debouncedFetchSuggestions()
})
//  #endregion

// dropdown options provided as props, will be updated with database access
const props = defineProps({
  beverages: { type: Array },
  manufacturers: { type: Array }
})

const name = ref('')
const type = ref('')
const manufacturer = ref('')
const form = ref(null)

const checkField = (v) => {
  if (!v || v.length < 1) {
    return
  }
  return true
}

const requiredRule = [(v) => checkField(v) || 'Required field.']

const validate = () => {
  form.value.validate()
  return checkField(name.value) && checkField(type.value) && checkField(manufacturer.value)
}

defineExpose({ validate, name, type, manufacturer })
</script>

<template>
  <v-container class="stepper-field rounded-lg">
    <v-form ref="form">
      <v-row>
        <v-col class="me-0 pe-0 w-50">
          <v-card-title class="pl-4">Product Name:</v-card-title>
          <v-text-field
            v-model="name"
            :bg-color="'white'"
            class="w-50 pl-4"
            hint='Format name as "Brand Flavor Product", e.g. "Arizona Raspberry Green Tea"'
            persistent-hint
            placeholder="Type something..."
            :rules="requiredRule"
            style="min-width: 30vw"
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col class="ml-0 pl-0">
          <v-card-title class="ml-0 pl-0">Beverage Type:</v-card-title>
          <v-autocomplete
            v-model="type"
            :bg-color="'white'"
            class="w-50"
            :items="beverages"
            :rules="requiredRule"
            variant="outlined"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-col class="w-66">
        <v-card-title class="ml-0 pl-0 mb-0 pb-2">Manufacturer:</v-card-title>
        <v-autocomplete
          v-model="manufacturer"
          v-model:search="input"
          :items="suggestions"
          :loading="isLoading"
          :rules="requiredRule"
          :bg-color="'white'"
          class="w-50 ml-0 pl-0"
          style="max-width: 20vw"
          variant="outlined"
          @click="fetchSuggestions"
        ></v-autocomplete>
      </v-col>
    </v-form>
  </v-container>
</template>

<style scoped>
.stepper-field {
  background-color: rgb(235, 235, 235);
}
</style>
