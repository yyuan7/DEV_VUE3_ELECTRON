<!-- Original Version: not reusable -->
<template>
  <v-autocomplete
    v-model="input"
    v-model:search="search"
    :items="suggestion"
    :loading="isLoading"
    :bg-color="'white'"
    class="text-box pl-4 mb-0 pb-0"
    placeholder="e.g. Raspberry Green Tea"
    clearable
    style="max-width: 315px"
    variant="outlined"
    @input="fetchsuggestion"
  ></v-autocomplete>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { debounce } from 'lodash-es'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
import { getUpcList } from '@/renderer/api/upc'
import { UpcData } from '@/renderer/api/upc/type'

const snackbarStore = useSnackbarStore()
const input = ref(undefined)
const search = ref('')
const suggestion = ref<string[]>([])
const isLoading = ref(false)

const fetchsuggestion = async () => {
  isLoading.value = true
  try {
    const responseUpc = await getUpcList({ name: search.value })
    suggestion.value = [
      ...new Set(responseUpc.data.list.map((manufacturer: UpcData) => manufacturer.name))
    ]
  } catch (error) {
    snackbarStore.showErrorMessage(`Fetching Error: ${error}`)
  } finally {
    isLoading.value = false
  }
}

const debouncedFetchsuggestion = debounce(fetchsuggestion, 300)

watch(input, (newValue) => {
  debouncedFetchsuggestion()
})
</script>

<style lang="scss" scoped></style>

<!-- Resuable Version -->
<!-- <template>
  <v-autocomplete
    v-model="inputManu"
    :items="suggestionManu"
    :item-title="itemTitle"
    :item-value="itemValue"
    :loading="isLoadingManu"
    :bg-color="'white'"
    class="text-box pl-4 mb-0 pb-0"
    :placeholder="placeholder"
    clearable
    style="max-width: 315px"
    variant="outlined"
    @click="fetchsuggestionManu"
    @update:model-value="updateValue"
  ></v-autocomplete>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import { debounce } from 'lodash-es'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'

const props = defineProps<{
  placeholder: string
  fetchItems: (query: string) => Promise<any[]>
  itemMapper: (item: any) => string
  itemTitle: (item: any) => string
  itemValue: (item: any) => string | number
}>()

const emits = defineEmits<{
  (e: 'update:model-value', value: string | number): void
}>()

const snackbarStore = useSnackbarStore()
const inputManu = ref<string | undefined>(undefined)
const suggestionManu = ref<any[]>([])
const isLoadingManu = ref(false)

const fetchsuggestionManu = async () => {
  isLoadingManu.value = true
  try {
    const response = await props.fetchItems(inputManu.value || '')
    suggestionManu.value = [...new Set(response.map(props.itemMapper))]
  } catch (error) {
    snackbarStore.showErrorMessage(`Fetching Error: ${error}`)
  } finally {
    isLoadingManu.value = false
  }
}

const debouncedFetchsuggestionManu = debounce(fetchsuggestionManu, 300)

watch(inputManu, () => {
  debouncedFetchsuggestionManu()
})

const updateValue = (value: string | number) => {
  emits('update:model-value', value)
}
</script> -->
