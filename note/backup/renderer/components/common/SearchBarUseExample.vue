<template>
  <SuggestSearch
    placeholder="Select Manufacturer"
    :fetch-items="fetchManufacturers"
    :item-mapper="mapManufacturer"
    :item-title="(item) => item.name"
    :item-value="(item) => item.id"
    @update:model-value="onManufacturerSelected"
  />
</template>

<script setup lang="ts">
import SuggestSearch from '@/renderer/components/common/SearchBar.vue'
import { getCompanyList } from '@/renderer/api/admin/general'
import { Company } from '@/renderer/api/admin/general/type'
import { suggestPaginationData } from '@/renderer/constants/pagination'

const fetchManufacturers = async (query: string) => {
  const response = await getCompanyList({
    currentPage: suggestPaginationData.currentPage,
    size: suggestPaginationData.pageSize,
    totalPages: suggestPaginationData.totalPages,
    name: query,
    state: '',
    type: 'Manufacturer'
  })
  return response.data.list
}

const mapManufacturer = (manufacturer: Company) => manufacturer.name

const onManufacturerSelected = (selectedValue: string | number) => {
  console.log('Selected Manufacturer ID:', selectedValue)
}
</script>
