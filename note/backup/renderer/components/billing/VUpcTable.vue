<script setup lang="ts">
import { getRulesForUPC } from '@/renderer/api/billing'
import { UpcData } from '@/renderer/api/upc/type'
import { getRuleCount } from '@/renderer/utils/ruleUPCHelper'
import { tableHeaderColor } from '@/renderer/utils/stateColorGetter'
import { lists, billingRules as rules } from '@/renderer/views/billing/sampleData'
import { ref, onMounted, computed } from 'vue'

const props = defineProps<{
  UPCsToDisplay: UpcData[] // UPCs displayed in this table
  state: string // currently active state
  name: boolean // whether to display product name
}>()

interface UpdatedUPC extends UpcData {
  ruleStatus: string
}

const newData = ref<UpdatedUPC[]>([])
const dataStatus = ref<number>(0)

const getHeaders = () => {
  if (props.name)
    return ['UPC', 'Product Name', 'Manufacturer', 'Type', 'Material', 'Billing Rules']
  return ['UPC', 'Manufacturer', 'Type', 'Material', 'Billing Rules']
}

const getFields = (upc: UpcData) => {
  if (props.name) return [upc.upcCode, upc.name, upc.manufacturer, upc.beverageType, upc.material]
  return [upc.upcCode, upc.manufacturer, upc.beverageType, upc.material]
}

const getBillingInfo = async (upc: UpcData) => {
  const formData = { upcCode: upc.upcCode, state: props.state }
  const toUpdate = newData.value.find((entry) => entry.upcCode === upc.upcCode)
  if (!toUpdate) return
  try {
    const response = await getRulesForUPC(formData)
    return response.data.info
  } catch (error) {
    // snackbarStore.showErrorMessage(`Search Error: ${error}`)
  }
}

onMounted(() => {
  if (props.UPCsToDisplay.length === 0) return
  props.UPCsToDisplay.forEach((upc) => newData.value.push({ ...upc, ruleStatus: '' }))
  try {
    newData.value.forEach(async (data) => {
      const status = await getBillingInfo(data)
      if (status) data.ruleStatus = status
      else console.log('oh no')
    })
  } finally {
    dataStatus.value += 1
  }
})
</script>

<template>
  <v-data-table
    class="rounded-sm"
    :class="name ? 'with-name' : 'no-name'"
    style="border: 1px solid #898ea1; max-height: 15vh"
    hide-default-footer
    :key="dataStatus"
  >
    <tr>
      <th
        v-for="header of getHeaders()"
        :key="header"
        class="upc-header"
        :style="{ backgroundColor: tableHeaderColor(state) }"
      >
        {{ header }}
      </th>
    </tr>
    <tr v-for="upc of newData" :key="upc.upcCode">
      <td class="upc-data" v-for="field of getFields(upc)" :key="field">
        {{ field }}
      </td>
      <td class="upc-data">{{ upc.ruleStatus }}</td>
    </tr>
  </v-data-table>
</template>

<style scoped>
@import '@/renderer/styles/lowAdmin.css';
@import '@/renderer/styles/billing.css';
.with-name {
  max-width: 70vw;
}
.no-name {
  max-width: 60vw;
}
</style>
