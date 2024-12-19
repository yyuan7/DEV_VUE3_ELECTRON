<script setup lang="ts">
const props = defineProps<{
  headerType: String
  columns: string[]
  rows: string[]
  getRate: Function
}>()
</script>

<template>
  <v-data-table hide-default-footer class="fee-table">
    <tr>
      <th class="fee-header">{{ headerType }}</th>
      <th v-for="colName in columns" class="fee-header" v-bind:key="colName">
        {{ colName }}
      </th>
    </tr>
    <tr v-for="(rowItem, index) in rows" :key="rowItem" :class="index % 2 === 0 ? 'even-row' : ''">
      <td class="fee-data py-4">{{ rowItem }}</td>
      <td v-for="col in columns" class="fee-data" v-bind:key="col">
        {{ getRate(rowItem, col) }}
      </td>
    </tr>
  </v-data-table>
</template>
