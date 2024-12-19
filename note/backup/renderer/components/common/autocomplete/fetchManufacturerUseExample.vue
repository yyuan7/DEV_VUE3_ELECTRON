<template>
  <div>
    <!-- Default Version -->
    <fetchManufacturer
      ref="fetchManufacturerSuggestion"
      @update-manufacturer="handleManufacturerData"
    />
    <!-- Data Injected Version -->
    <fetchManufacturer
      ref="fetchManufacturerSuggestion"
      :initial-form-data="InjectedManufacturer"
      :placeholder="InjectedPlaceholder"
      @update-manufacturer="handleManufacturerData"
    />
    <v-btn @click="clear">Clear</v-btn>
    <v-btn @click="search">Search</v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import fetchManufacturer from '@/renderer/components/common/autocomplete/fetchCompany.vue'

const fetchManufacturerSuggestion = ref()
const manufacturer = ref<string | null>(null)

const InjectedManufacturer = ref('Injected Manufacturer')
const InjectedPlaceholder = ref('Injected Placeholder')

// Handle data emitted from Child Component
const handleManufacturerData = (data: string) => {
  manufacturer.value = data
}

const search = () => console.log(manufacturer.value)
const clear = () => fetchManufacturerSuggestion.value.resetForm()
</script>

<style lang="scss" scoped></style>
