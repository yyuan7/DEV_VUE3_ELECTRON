<script setup lang="ts">
import { PendingRateUpdate } from '@/renderer/api/admin/type'

const props = defineProps<{
  updatesToRender: PendingRateUpdate[]
  col1: string
  col2: string
}>()

const emit = defineEmits(['deletion'])

const deleteUpdate = (id: number) => {
  emit('deletion', id)
}
</script>

<template>
  <v-data-table hide-default-footer class="fee-table" :items="updatesToRender" fixed-header>
    <tr>
      <th class="fee-header">{{ col1 }}</th>
      <th
        v-for="column in [col2, 'New Amount (¢)', 'Activation Date', 'Reference Note', ' ']"
        class="fee-header"
        v-bind:key="column"
      >
        {{ column }}
      </th>
    </tr>
    <tr
      v-for="(update, index) in updatesToRender"
      :key="update.id"
      :class="index % 2 === 1 ? 'even-row' : ''"
    >
      <td class="fee-data py-5">{{ update[col1.toLowerCase()] }}</td>
      <td class="fee-data">{{ update.category }}</td>
      <td class="fee-data">{{ update.amount }}</td>
      <td class="fee-data">{{ update.date }}</td>
      <td class="fee-data">{{ update.note }}</td>
      <td class="fee-data trash-btn-data">
        <v-icon icon="mdi-trash-can-outline" @click="deleteUpdate(parseInt(update.id))"></v-icon>
      </td>
    </tr>
  </v-data-table>
</template>
