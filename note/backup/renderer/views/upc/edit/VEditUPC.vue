<!-- TODO: volume range change -> according to Dan, we should provide a volume range and users can also type their own value.
 For example, users may enter 10.00 which will be stored as 10, waiving the digits. -->
<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cloneDeep, debounce } from 'lodash-es'
import { getUpcInfo, updateUpcInfo } from '@/renderer/api/upc'
import { UpcData, ResReadUpcList } from '@/renderer/api/upc/type'
import { Note } from '@/renderer/api/common/type'
import { BeverageType, MaterialType, CommonVolumes } from '@/renderer/constants/upc'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
import { useUserStore } from '@/renderer/store/modules/userStore'
import { closeCurrentTag } from '@/renderer/utils/tag/close'
import { getCompanyList } from '@/renderer/api/admin/general'
import { Company } from '@/renderer/api/admin/general/type'
import { suggestPaginationData } from '@/renderer/constants/pagination'
import { getNotesAsString } from '@/renderer/utils/formatting'

const route = useRoute()
const router = useRouter()
const snackbarStore = useSnackbarStore()
const userStore = useUserStore()

// #region Default Original Data
const DEFAULT_FORM_DATA: UpcData = { upcCode: route.params.upcCode as string }
const upcData = ref<UpcData>({
  upcCode: '',
  name: '',
  manufacturer: '',
  material: undefined,
  beverageType: undefined,
  volumeSize: undefined,
  weight: undefined,
  notes: []
})
//  #endregion

// #region Inject Initial Data
const injectData = async () => {
  const upcCode = route.params.upcCode
  DEFAULT_FORM_DATA.upcCode = upcCode as string

  try {
    const response: ResReadUpcList = await getUpcInfo(upcCode as string)

    if (response.code === 200) {
      const targetUpc = response.data.list.at(0)

      if (targetUpc) {
        // DEFAULT_FORM_DATA.upcCode = targetUpc.upcCode
        DEFAULT_FORM_DATA.name = targetUpc.name || ''
        DEFAULT_FORM_DATA.manufacturer = targetUpc.manufacturer || undefined
        DEFAULT_FORM_DATA.material = (targetUpc.material as MaterialType) || undefined
        DEFAULT_FORM_DATA.beverageType = (targetUpc.beverageType as BeverageType) || undefined
        DEFAULT_FORM_DATA.volumeSize = targetUpc.volumeSize || undefined
        DEFAULT_FORM_DATA.weight = targetUpc.weight || undefined
        DEFAULT_FORM_DATA.notes = targetUpc.notes || []

        upcData.value = cloneDeep(DEFAULT_FORM_DATA)
      }
    } else {
      // prevent accessing UPC not exist
      snackbarStore.showErrorMessage(`Search Failed: ${response.data.message}`)
      closeCurrentTag(router, route)
      router.push({ path: '/404' })
    }
  } catch (error) {
    snackbarStore.showErrorMessage(`Search Error: ${error}`)
  }
}

onMounted(() => injectData())
//  #endregion

// #region Fetch Manufacturer
const placeholder = ref(upcData.value.manufacturer || 'Select Manufacturer')
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
    upcData.value.manufacturer = input.value
  }
}

const debouncedFetchSuggestions = debounce(fetchSuggestions, 300)

watch(input, () => {
  debouncedFetchSuggestions()
})
//  #endregion

// #region Add New Notes
const note = ref('')
// Send the new note only -> append to the note history in backend
//  #endregion

// #region Update the UPC info to the backend if any change
const isChanged = ref(false)

// detect change - deep watching for upcData
watch(
  [upcData, note],
  ([newUpcData, newNote], [oldUpcData, oldNote]) => {
    if (JSON.stringify(newUpcData) !== JSON.stringify(DEFAULT_FORM_DATA) || newNote !== '') {
      isChanged.value = true
    } else {
      isChanged.value = false
    }
  },
  { deep: true }
)

const update = async () => {
  if (!isChanged.value || note.value.length === 0) return

  // Step 1: pack the note into a Note object
  const newNote: Note = {
    message: note.value.trim(),
    username: userStore.username,
    date: new Date().toISOString()
  }
  // Step 2: combine all new info
  const updatedData: UpcData = {
    ...upcData.value,
    notes: [newNote] // Send the new note only, which will be appended to the note history in the backend
  }
  // Step 3: send to the backend
  try {
    const response = await updateUpcInfo(updatedData)
    console.log(response)

    if (response.code === 200) {
      // Step 4: redirect for success status code
      router.push({
        path: `/upc/edit/${upcData.value.upcCode}`,
        query: { step: 's2' }
      })
    } else {
      snackbarStore.showErrorMessage(`Update Failed: ${response.data.message}`)
    }
  } catch (error) {
    snackbarStore.showErrorMessage(`Update Error: ${error}`)
  }
}
//  #endregion

const getNotes = (notes) => {
  return getNotesAsString(notes)
}

const reset = () => {
  note.value = ''
  upcData.value = cloneDeep(DEFAULT_FORM_DATA)
  isChanged.value = false
}
</script>

<template>
  <v-container class="page-container" fluid>
    <v-card-title class="mb-0 pb-0 mt-0 pt-0 title-card"
      >Edit UPC: {{ upcData.upcCode }}</v-card-title
    >
    <hr class="hr-style mb-4 mt-0 pt-0" />
    <v-layout class="justify-end align-start mb-4" row>
      <v-btn class="me-6 cancel-button" @click="reset">reset</v-btn>
    </v-layout>
    <v-container
      class="green-container rounded-lg text-xs-center mb-6"
      style="margin-top: 2%; height: fit-content"
    >
      <v-card-title class="ma-0 pa-0 pb-4 text-h5" style="font-weight: 700"
        >Product Information:</v-card-title
      >
      <v-row class="justify-start position-relative">
        <v-card-title class="text-field">Product Name:</v-card-title>
        <v-text-field
          v-model="upcData.name"
          :bg-color="'white'"
          class="text-field"
          density="compact"
          :placeholder="upcData.name"
          variant="outlined"
        ></v-text-field>
        <v-card-title class="text-field">Manufacturer:</v-card-title>

        <v-autocomplete
          v-model="upcData.manufacturer"
          v-model:search="input"
          :items="suggestions"
          :loading="isLoading"
          :bg-color="'white'"
          class="text-box pl-4 mb-0 pb-0"
          :placeholder="placeholder"
          clearable
          style="max-width: 315px"
          variant="outlined"
          @click="fetchSuggestions"
        ></v-autocomplete>

        <v-card-title class="text-field">Product Type:</v-card-title>
        <v-select
          v-model="upcData.beverageType"
          :bg-color="'white'"
          class="pb-8 text-field input"
          :items="Object.values(BeverageType)"
          :placeholder="upcData.beverageType"
          return-object
          variant="outlined"
        ></v-select>
      </v-row>
    </v-container>
    <v-container class="green-container rounded-lg text-xs-center mb-6">
      <v-card-title class="ma-0 pa-0 pb-4 text-h5" style="font-weight: 700"
        >Package Information:</v-card-title
      >
      <v-row class="justify-start position-relative">
        <v-card-title class="text-field">Material:</v-card-title>
        <v-select
          v-model="upcData.material"
          :bg-color="'white'"
          class="pb-8 text-field"
          :items="Object.values(MaterialType)"
          :placeholder="upcData.material"
          :value="upcData.material"
          return-object
          variant="outlined"
          >{{ upcData.material }}</v-select
        >
        <v-card-title class="text-field">Volume:</v-card-title>
        <!-- TODO -->
        <v-combobox
          v-model="upcData.volumeSize"
          :bg-color="'white'"
          class="pb-8 text-field"
          :items="Object.values(CommonVolumes)"
          :placeholder="upcData.volumeSize?.toString()"
          return-object
          variant="outlined"
        ></v-combobox>
        <v-card-title class="text-field">Units:</v-card-title>
        <v-text-field
          :bg-color="'white'"
          class="text-field mass-format opacity-100"
          density="compact"
          disabled
          variant="outlined"
          >oz.</v-text-field
        >
        <v-card-title class="text-field">Weight (lbs):</v-card-title>
        <v-text-field
          v-model="upcData.weight"
          :bg-color="'white'"
          class="pb-8 text-field"
          :placeholder="upcData.weight?.toString()"
          return-object
          style="max-width: 15vw"
          type="number"
          variant="outlined"
        ></v-text-field>
      </v-row>
    </v-container>
    <v-container class="green-container mb-6 rounded-lg text-xs-center">
      <v-row>
        <v-col>
          <v-card-title class="text-field pt-0 mt-0"
            >Add a note detailing your changes (required):</v-card-title
          >
          <v-textarea
            v-model="note"
            :bg-color="'white'"
            class="note-field"
            no-resize
            :placeholder="'e.g. Volume changed from 22 to 18 oz.'"
            rows="2"
            variant="outlined"
            :rules="[(v) => !!v || 'Required field.']"
          ></v-textarea>
        </v-col>
        <v-col>
          <v-card-title class="text-field pt-0 mt-0">Note History</v-card-title>
          <v-textarea
            :bg-color="'white'"
            class="note-field rounded-md"
            :model-value="getNotes(upcData.notes)"
            no-resize
            readonly
            rows="5"
            variant="outlined"
          >
          </v-textarea>
        </v-col>
      </v-row>
      <v-row class="justify-end align-end pb-4 pt-0 mt-0">
        <v-btn class="me-4 cancel-button" @click="closeCurrentTag(router, route)">cancel</v-btn>
        <v-btn class="me-4" color="#0a762b" :disabled="!isChanged" @click="update">update</v-btn>
      </v-row>
    </v-container>
  </v-container>
</template>

<style scoped>
@import '../upcMgmt.css';
.header-contain {
  background-color: rgba(228, 24, 24, 0.664);
  width: 50vh;
}
.text-field {
  padding: 1%;
  max-width: 500px;
  max-height: 10vh;
}
.mass-format {
  min-width: 0px;
  max-width: 300px;
  width: 50px;
}
.note-field {
  max-width: 700px;
  background-color: transparent;
}
</style>
