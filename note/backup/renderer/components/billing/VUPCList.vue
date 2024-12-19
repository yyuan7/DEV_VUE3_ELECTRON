<script setup lang="ts">
import { UpcData } from '@/renderer/api/upc/type'
import { tableHeaderColor } from '@/renderer/utils/stateColorGetter'
import { defineProps, ref, defineExpose } from 'vue'

const props = defineProps<{
  state: string // currently selected state
  features: string[] // features to include in the list
}>()

const upcs = defineModel<UpcData[]>()

const usableUPCs = ref<UpcData[]>([])
upcs.value?.forEach((upc) => usableUPCs.value.push(upc))

const selected = ref<UpcData[]>([])
const headers = ['Code', 'Product Name', 'Type', 'Manufacturer', 'Size (oz.)', 'Material']
const allSelected = ref<Boolean>(false)

const selectAllClick = () => {
  if (allSelected.value) {
    allSelected.value = false
    if (selected.value.length === usableUPCs.value.length) {
      selected.value = []
    }
    console.log('deselecting')
  } else {
    allSelected.value = true
    upcs.value?.forEach((upc) => selected.value.push(upc))
    console.log('selecting')
  }
}

const deselectAll = () => {
  selected.value = []
  allSelected.value = false
}

const toggleSelect = (upc: UpcData) => {
  const index = selected.value.indexOf(upc)
  if (index === -1) {
    if (props.features.includes('noMultiple')) deselectAll()
    selected.value.push(upc)
  } else {
    allSelected.value = false
    selected.value.splice(index, 1)
  }
}

const addToList = (toAdd: UpcData[]) => {
  usableUPCs.value.push(
    ...toAdd.filter(
      (newUPC) => !usableUPCs.value.some((upc: UpcData) => upc.upcCode === newUPC.upcCode)
    )
  )
}

const removeFromTable = (upc: UpcData) => {
  if (!usableUPCs.value) return
  const idx = usableUPCs.value.indexOf(upc)
  if (idx !== -1) usableUPCs.value.splice(idx, 1)
}

const clear = () => {
  usableUPCs.value = []
}

defineExpose({ selected, deselectAll, usableUPCs, addToList, clear })
</script>

<template>
  <v-data-table
    loading-text="Loading..."
    no-data-text="No Results"
    dense
    single-select
    hide-default-footer
    class="pa-4 pt-0"
    style="background-color: transparent; max-height: 40vh"
  >
    <tr>
      <td
        v-if="features.includes('checkbox')"
        class="upc-header"
        :style="{ backgroundColor: tableHeaderColor(state) }"
      >
        <v-btn
          v-if="!props.features.includes('noMultiple')"
          class="ma-0 pa-0"
          :icon="allSelected ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'"
          density="compact"
          style="background-color: transparent; color: white; max-height: 3vh !important"
          flat
          @click="selectAllClick()"
        />
      </td>
      <td
        v-for="header in headers"
        :key="header"
        class="upc-header"
        :style="{ backgroundColor: tableHeaderColor(state) }"
      >
        {{ header }}
      </td>
      <td
        v-if="features.includes('deletable')"
        class="upc-header"
        :class="{ 'ma-0 pa-0': features.includes('compact') }"
        :style="{ backgroundColor: tableHeaderColor(state) }"
      ></td>
    </tr>
    <tr
      v-for="(upc, index) in usableUPCs"
      :key="upc.upcCode"
      :class="index % 2 === 0 ? 'even-row' : 'odd-row'"
    >
      <td
        v-if="features.includes('checkbox')"
        class="upc-data my-0 py-0"
        :class="{ 'ma-0 pa-0': features.includes('compact') }"
        style="min-height: 0%"
      >
        <v-btn
          class="ma-0 pa-0"
          :icon="selected.includes(upc) ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'"
          density="compact"
          style="background-color: transparent; color: black; max-height: 3vh !important"
          flat
          @click="toggleSelect(upc)"
        />
      </td>
      <td
        v-for="(field, index) in [
          upc.upcCode,
          upc.name,
          upc.beverageType,
          upc.manufacturer,
          upc.volumeSize,
          upc.material
        ]"
        :key="field"
        :class="{
          'upc-data': true,
          'truncate-column': index === 1 || index === 3,
          'fit-content': index !== 1 && index !== 3,
          'ma-0 pa-0': features.includes('compact')
        }"
        style="min-height: 0%; border-right: 1px dashed #898ea1; border-left: 1px dashed #898ea1"
      >
        {{ field }}
      </td>
      <td
        v-if="features.includes('deletable')"
        style="min-height: 0%"
        :class="{ 'ma-0 pa-0': features.includes('compact') }"
      >
        <v-btn
          class="ma-0 pa-0 pl-2"
          :icon="'mdi-close'"
          density="compact"
          style="background-color: transparent; color: red"
          flat
          @click="removeFromTable(upc)"
        />
      </td>
    </tr>
  </v-data-table>
</template>

<style scoped>
@import '@/renderer/styles/lowAdmin.css';
@import '@/renderer/styles/billing.css';
</style>
