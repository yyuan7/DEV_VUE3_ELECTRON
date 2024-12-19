<script setup lang="ts">
import { Modification, PendingRateUpdate } from '@/renderer/api/admin/type'

const props = defineProps<{
  updateHistory: Modification[]
  updates: PendingRateUpdate[] // passed as prop, will likely read from database eventually
  metric: String
  distributor?: string
}>()

const findUpdateById = (id: string) => {
  for (let i = 0; i < props.updates.length; i++) {
    const update = props.updates[i]

    // if (props.distributor && update.distributor !== props.distributor) return;     <- put back when database fixed - references don't work with sample data
    if (update.id === id) return props.updates[i]
  }
}

const translateStatus = (status: string) => {
  if (status === 'deleted') return 'Delete Pending Update'
  return 'Update'
}

const getDistributorIfNeeded = (update: PendingRateUpdate) => {
  if (props.metric === 'material') return ' ' + update.distributor
  return ''
}

const getUpdateDescription = (update: PendingRateUpdate) => {
  return (
    translateStatus(update.status) +
    ' - ' +
    update.state +
    getDistributorIfNeeded(update) +
    ' ' +
    update.category +
    ' to ' +
    update.amount +
    '¢ from ' +
    update.date
  )
}

const getNotesAsString = () => {
  let message = ''
  for (let i = props.updateHistory.length - 1; i >= 0; i--) {
    const item = props.updateHistory[i]
    const update = findUpdateById(item.updateId)
    if (update) {
      message =
        message +
        'Date: ' +
        item.date +
        '\n' +
        'Author: ' +
        item.author +
        '\n' +
        'Behavior: ' +
        getUpdateDescription(update) +
        '\n' +
        'Reference Note: ' +
        update.note
      if (i > 0) {
        message = message + '\n \n'
      }
    }
  }
  if (message.length === 0)
    return 'Distributor has no negotiated rate history in the selected state.'
  return message
}
</script>

<template>
  <v-container class="fee-card">
    <v-card-title class="section-titles ma-0 pa-0">Modification History</v-card-title>
    <v-textarea
      :bg-color="'white'"
      readonly
      variant="outlined"
      :model-value="getNotesAsString()"
      auto-grow
      rows="1"
      style="max-height: 70vh; overflow-y: auto"
      hide-details
      class="pb-6"
      no-resize
    ></v-textarea>
  </v-container>
</template>

<style scoped>
@import '@/renderer/styles/lowAdmin.css';
</style>
