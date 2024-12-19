<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { BetterBillingRule, BillingRule, RuleDisplay } from '@/renderer/api/billing/type'
import { formatDate, reformatRules } from '@/renderer/utils/formatting'
import { tableHeaderColor } from '@/renderer/utils/stateColorGetter'

const props = defineProps<{
  state: string // currently active state
  rulesToDisplay: BetterBillingRule[]
  features: string[]
}>()

const headers = ['Initiator', 'Distributor', 'Pickup Agent', 'Regions', 'Start Date', 'End Date']

const dataToDisplay = ref<RuleDisplay[]>([])

reformatRules(props.rulesToDisplay, dataToDisplay.value)

const allSelected = ref<boolean>(false)
const selected = defineModel<RuleDisplay[]>()

const selectAllClick = () => {
  if (allSelected.value) {
    allSelected.value = false
    if (selected.value?.length === dataToDisplay.value.length) {
      selected.value = []
    }
  } else {
    allSelected.value = true
    selected.value = [...dataToDisplay.value]
  }
}

const toggleSelect = (rule: RuleDisplay) => {
  const index = selected.value?.indexOf(rule)
  if (index === -1 && selected.value) {
    selected.value.push(rule)
    if (selected.value.length === dataToDisplay.value.length) allSelected.value = true
  } else {
    allSelected.value = false
    selected.value?.splice(index, 1)
  }
}

defineExpose({ dataToDisplay })
</script>

<template>
  <v-data-table hide-default-footer>
    <tr>
      <td
        v-if="features.includes('checkbox')"
        class="upc-header"
        :style="{ backgroundColor: tableHeaderColor(state) }"
      >
        <v-btn
          class="ma-0 pa-0"
          :icon="allSelected ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'"
          density="compact"
          style="background-color: transparent; color: white; max-height: 3vh !important"
          flat
          @click="selectAllClick()"
        />
      </td>
      <th
        v-if="features.includes('number')"
        class="upc-header"
        :style="{ backgroundColor: tableHeaderColor(state) }"
      >
        Pattern
      </th>
      <th
        v-if="!features.includes('no-upc')"
        class="upc-header"
        :style="{ backgroundColor: tableHeaderColor(state) }"
      >
        UPC
      </th>
      <th
        v-if="!features.includes('no-upc')"
        class="upc-header"
        :style="{ backgroundColor: tableHeaderColor(state) }"
      >
        Product Name
      </th>
      <th
        v-if="!features.includes('no-upc')"
        class="upc-header"
        :style="{ backgroundColor: tableHeaderColor(state) }"
      >
        Manufacturer
      </th>
      <th
        v-for="(header, index) in headers"
        :key="index"
        class="upc-header"
        :style="{ backgroundColor: tableHeaderColor(state) }"
      >
        {{ header }}
      </th>
    </tr>
    <tr
      v-for="(data, index) in dataToDisplay"
      :key="index"
      :class="index % 2 === 0 ? 'even-row' : 'odd-row'"
    >
      <td class="upc-data" style="min-height: 0%" v-if="features.includes('checkbox')">
        <v-btn
          class="ma-0 pa-0"
          :icon="selected?.includes(data) ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'"
          density="compact"
          style="background-color: transparent; color: black; max-height: 3vh !important"
          flat
          @click="toggleSelect(data)"
        />
      </td>
      <td v-if="features.includes('number')" class="upc-data">
        {{ data.ruleID }}
      </td>
      <td v-if="!features.includes('no-upc')" class="upc-data my-0 py-0" style="min-height: 0%">
        {{ data.upc.upcCode }}
      </td>
      <td v-if="!features.includes('no-upc')" class="upc-data my-0 py-0" style="min-height: 0%">
        {{ data.upc.name }}
      </td>
      <td v-if="!features.includes('no-upc')" class="upc-data my-0 py-0" style="min-height: 0%">
        {{ data.upc.manufacturer }}
      </td>
      <td
        v-for="(field, index) in [
          data.rules[0].initiator,
          data.rules[0].distributor,
          data.rules[0].pickupAgent
        ]"
        :key="index"
        class="upc-data my-0 py-0"
        style="min-height: 0%"
      >
        {{ field }}
      </td>
      <td class="upc-data my-0 py-0" style="min-height: 0%">
        <v-btn
          :ripple="false"
          flat
          :class="data.regions.length === 1 ? 'disable-events' : ''"
          style="color: black; background-color: transparent"
        >
          <div>{{ data.regions[0] }}</div>
          <div v-if="data.regions.length > 1">...</div>
          <v-menu v-if="data.regions.length > 1" activator="parent" open-on-hover>
            <v-list>
              <v-list-item
                v-for="(dataRegion, idx) in data.regions"
                :key="idx"
                :value="idx"
                disabled
                density="compact"
              >
                <v-list-item-title>{{ dataRegion }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </td>
      <td class="upc-data my-0 py-0" style="min-height: 0%">
        {{ formatDate(data.rules[0].startDate) }}
      </td>
      <td class="upc-data my-0 py-0" style="min-height: 0%">
        {{ data.rules[0].endDate ? formatDate(data.rules[0].endDate) : '' }}
      </td>
    </tr>
  </v-data-table>
</template>

<style scoped>
@import '@/renderer/styles/lowAdmin.css';
@import '@/renderer/styles/billing.css';
.disable-events {
  pointer-events: none;
}
</style>
