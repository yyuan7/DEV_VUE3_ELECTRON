<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { VSearchOptions, VFilterOptions } from '@/renderer/components/upcMgmt/searchProcess'
import { ReqSearchUpc, ReqFilterUpc, ReqSearchOrFilterUpc } from '@/renderer/api/upc/type'
import { closeCurrentTag } from '@/renderer/utils/tag/close'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'

const router = useRouter()
const route = useRoute()
const snackbarStore = useSnackbarStore()
// References to data emitted from child components
const searchFormData = ref<ReqSearchUpc | null>(null)
const filterFormData = ref<ReqFilterUpc | null>(null)

// Combined data object for the final API request
const combinedFormData = ref<ReqSearchOrFilterUpc | null>(null)

// Reference to child components for method calls
const searchComponent = ref()
const filterComponent = ref()

// Handle data emitted from Child Component 1
const handleSearchData = (data: ReqSearchUpc) => {
  searchFormData.value = data
}

// Handle data emitted from Child Component 2
const handleFilterData = (data: ReqFilterUpc) => {
  filterFormData.value = data
}

// Search button: collect and send data from both forms to the API
const search = async () => {
  // Ensure parent data is up-to-date
  searchComponent.value.updateParentFormData()
  filterComponent.value.updateParentFormData()

  // Merge search and filter data into one object
  combinedFormData.value = {
    ...searchFormData.value,
    ...filterFormData.value
  }

  // Send the merged data to the backend
  if (combinedFormData.value) {
    try {
      router.push({
        name: 'UPC-Result',
        query: {
          // name: combinedFormData.value.name || '',
          combinedFormData: JSON.stringify(combinedFormData.value)
        }
      })
    } catch (error) {
      snackbarStore.showErrorMessage(`Search Error: ${error}`)
    }
  }
}

// Clear button: reset forms in both child components
const clearForm = () => {
  searchComponent.value.resetForm()
  filterComponent.value.resetForm()
}

// Cancel button: reset data in parent (optional additional logic, e.g., closing the form)
const cancelSearch = () => {
  searchFormData.value = null
  filterFormData.value = null
  closeCurrentTag(router, route)
}
</script>

<template>
  <v-container class="page-container">
    <v-card-title class="mb-0 pb-0 mt-0 pt-0 title-card">Search UPCs</v-card-title>
    <hr class="hr-style mb-4 mt-0 pt-0" />
    <v-layout class="justify-end align-start mb-4" row>
      <v-btn class="me-6 cancel-button justify-end" @click="clearForm">clear</v-btn>
    </v-layout>
    <VSearchOptions ref="searchComponent" @update-search-data="handleSearchData" />
    <VFilterOptions ref="filterComponent" @update-filter-data="handleFilterData" />
    <v-layout class="justify-end align-end pb-4 pt-0 mt-0" row>
      <v-btn class="me-4 cancel-button" @click.prevent.stop="cancelSearch">cancel</v-btn>
      <v-btn class="me-4" color="#0a762b" @click="search">Search</v-btn>
    </v-layout>
  </v-container>
</template>

<style>
@import '../upcMgmt.css';
.text-box {
  padding: 0%;
  height: 7%;
}
.text {
  max-width: 190px;
  font-size: 120%;
}
.title {
  font-size: 150%;
  font-weight: 600;
}
.testing {
  color: black !important;
  font-weight: 700;
}
</style>
