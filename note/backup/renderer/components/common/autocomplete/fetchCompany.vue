<script setup lang="ts">
import { initCustomFormatter, ref, watch } from 'vue'
import { debounce } from 'lodash-es'
import { getCompanyList } from '@/renderer/api/admin/general'
import { Company } from '@/renderer/api/admin/general/type'
import { suggestPaginationData } from '@/renderer/constants/pagination'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'

// Define props
const props = defineProps<{
  placeholder: string
  rules?: any[]
  compact?: boolean
  disable?: boolean
}>()

const fieldInForm = defineModel<string | null>()

// #region Auto-Prompt
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

  // Use cache to avoid redundant requests
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
      state: '', // wait to be injected
      type: 'Manufacturer' // wait to be injected
    })

    const newSuggestions = [...new Set(response.data.list.map((target: Company) => target.name))]
    suggestionsCache.set(trimmedInput, newSuggestions)
    suggestions.value = newSuggestions
  } catch (error) {
    console.error('Fetching error:', error)
    snackbarStore.showErrorMessage('Unable to fetch suggestions. Please try again.')
  } finally {
    isLoading.value = false
    fieldInForm.value = input.value
  }
}

const debouncedFetchSuggestions = debounce(fetchSuggestions, 300)

watch(input, () => {
  debouncedFetchSuggestions()
})
// #endregion
</script>

<template>
  <v-autocomplete
    v-model="fieldInForm"
    v-model:search="input"
    :items="suggestions"
    :loading="isLoading"
    :bg-color="'white'"
    class="text-box mb-0 pb-0"
    :placeholder="placeholder"
    clearable
    variant="outlined"
    :rules="rules"
    :density="compact ? 'compact' : 'default'"
    :disabled="disable"
    @click="fetchSuggestions"
  >
    <template #no-data>
      <v-card-text class="ma-0 pa-1 pl-4" style="font-size: 95%"
        >Start typing to search.</v-card-text
      >
    </template>
  </v-autocomplete>
</template>
