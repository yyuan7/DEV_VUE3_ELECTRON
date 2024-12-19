<script setup lang="ts">
import { BillingRule } from '@/renderer/api/billing/type'
import { tableHeaderColor } from '@/renderer/utils/stateColorGetter'
import { formatDate } from '@/renderer/utils/formatting'
import { ref } from 'vue'

const props = defineProps<{
  features: string[]
  /* feature options: 
          'deletable' allows deletion of rules from v-model
          'checkbox' allows selection of rules, which is exposed to parent
          'single' allows one selection at a time (must be accompanied by checkbox)
          'showUPC' shows UPC data as well as billing rule data
  */
  state: string
}>()

const rules = defineModel<BillingRule[]>()

const selected = ref<BillingRule[]>([])
const headers = ['Initiator', 'Pickup Agent', 'Distributor', 'Region', 'Start Date', 'End Date']
const allSelected = ref<Boolean>(false)

const selectAllClick = () => {
  if (props.features.includes('single')) return
  if (allSelected.value) {
    allSelected.value = false
    if (selected.value.length === rules.value?.length) {
      selected.value = []
    }
  } else {
    allSelected.value = true
    selected.value = rules.value ? [...rules.value] : []
  }
}

const toggleSelect = (rule: BillingRule) => {
  const index = selected.value.indexOf(rule)
  if (index === -1) {
    if (props.features.includes('single')) selected.value = []
    selected.value.push(rule)
  } else {
    allSelected.value = false
    selected.value.splice(index, 1)
  }
}

const addAndReplace = (toAdd: BillingRule[]) => {
  rules.value = toAdd
}

const addToList = (toAdd: BillingRule[]) => {
  rules.value?.push(
    ...toAdd.filter((newRule) => !rules.value?.some((rule: BillingRule) => rule.id === newRule.id))
  )
}

const deselectAll = () => {
  selected.value = []
  allSelected.value = false
}

const removeFromTable = (rule: BillingRule) => {
  if (!rules.value) return
  const idx = rules.value?.indexOf(rule)
  console.log(idx)
  if (idx !== -1) rules.value.splice(idx, 1)
}

const clear = () => {
  rules.value = []
}

defineExpose({ selected, deselectAll, rules, addToList, clear, addAndReplace })
</script>

<template>
  <v-data-table
    loading-text="Loading..."
    no-data-text="No Results"
    dense
    single-select
    hide-default-footer
    class="d-flex justicy-center mx-auto pt-0"
    :class="features.includes('heightLimit') ? 'short-height-limit' : 'reg-height-limit'"
    style="background-color: transparent; max-width: 1400px; min-width: 40vw"
  >
    <tr>
      <td
        v-if="features.includes('checkbox')"
        class="upc-header"
        :style="{ backgroundColor: tableHeaderColor(state) }"
      >
        <v-btn
          v-if="!features.includes('single')"
          class="ma-0 pa-0"
          :icon="allSelected ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'"
          density="compact"
          style="background-color: transparent; color: white; max-height: 3vh !important"
          flat
          @click="selectAllClick()"
        />
      </td>
      <td
        v-if="features.includes('showUPC')"
        class="upc-header"
        :style="{ backgroundColor: tableHeaderColor(state) }"
      >
        UPC
      </td>
      <td
        v-for="header in headers"
        :key="header"
        class="upc-header"
        :style="{ backgroundColor: tableHeaderColor(state) }"
        text-no-wrap
      >
        {{ header }}
      </td>
      <td
        v-if="features.includes('deletable')"
        class="upc-header"
        :style="{ backgroundColor: tableHeaderColor(state) }"
      ></td>
    </tr>
    <tr
      v-for="(rule, index) in rules"
      :key="rule.id"
      :class="index % 2 === 0 ? 'even-row' : 'odd-row'"
    >
      <td v-if="features.includes('checkbox')" class="upc-data" style="min-height: 0%">
        <v-btn
          class="ma-0 pa-0"
          :icon="selected.includes(rule) ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'"
          density="compact"
          style="background-color: transparent; color: black; max-height: 3vh !important"
          flat
          @click="toggleSelect(rule)"
        />
      </td>
      <td v-if="features.includes('showUPC')" class="upc-data ma-0 pa-0">
        {{ rule.upcCode }}
      </td>
      <td
        v-for="(field, index) in [
          rule.initiator,
          rule.pickupAgent,
          rule.distributor,
          rule.region,
          formatDate(rule.startDate),
          formatDate(rule.endDate || null)
        ]"
        :key="field"
        :class="{
          'upc-data': true,
          'truncate-column': index === 1 || index === 3,
          'fit-content': index !== 1 && index !== 3
        }"
        style="min-height: 0%; border-right: 1px dashed #898ea1; border-left: 1px dashed #898ea1"
        class="my-1 py-1"
      >
        {{ field }}
      </td>
      <td v-if="features.includes('deletable')" style="min-height: 0%">
        <v-btn
          class="ma-0 pa-0 pl-2"
          :icon="'mdi-close'"
          density="compact"
          style="background-color: transparent; color: red"
          flat
          @click="removeFromTable(rule)"
        />
      </td>
    </tr>
  </v-data-table>
  <v-card-text
    class="d-flex justify-center mx-auto text-center"
    v-if="rules?.length === 0"
    style="font-size: 100%"
    >No billing rules.</v-card-text
  >
</template>

<style scoped>
@import '@/renderer/styles/lowAdmin.css';
@import '@/renderer/styles/billing.css';
.short-height-limit {
  max-height: 15vh;
}
.reg-height-limit {
  max-height: 30vh;
}
</style>
