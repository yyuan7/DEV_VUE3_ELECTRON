<script setup lang="ts">
import { ref, computed } from 'vue'
import { stateButtonColor } from '@/renderer/utils/stateColorGetter'

const props = defineProps<{
  type: string
}>()

const finalPopup = defineModel<string>()

const openFinalPopup = computed(() => {
  return finalPopup.value !== 'closed'
})

const emit = defineEmits(['closeTab'])
</script>

<template>
  <v-dialog
    v-model="openFinalPopup"
    :max-width="finalPopup === 'success' ? 350 : 450"
    overflow="hidden"
  >
    <v-card class="text-center">
      <v-toolbar style="background-color: #bbdbb2" v-if="finalPopup === 'success'">
        <v-icon class="ml-4" size="large" color="#26852a">mdi-check-circle</v-icon>
        <v-card-title>{{ finalPopup === 'success' ? 'Success!' : 'Upload Failed' }}</v-card-title>
      </v-toolbar>
      <v-toolbar style="background-color: #ffcdcd" v-if="finalPopup === 'fail'">
        <v-icon class="ml-4" size="large" color="#f44336">mdi-close-circle</v-icon>
        <v-card-title>Upload Failed.</v-card-title>
      </v-toolbar>
      <v-card-text class="text-center mb-2 pb-0" v-if="finalPopup === 'success'"
        >{{ type }} added successfully.</v-card-text
      ><v-card-text class="text-center mb-2 pb-0" v-if="finalPopup === 'fail'"
        >Could not add {{ type }} to database. Please try again later, or contact support if the
        problem persists.</v-card-text
      >
      <template #actions>
        <v-row class="d-flex justify-center">
          <v-btn
            v-if="finalPopup === 'success'"
            class="cancel-button mr-4 mb-2"
            style="height: 35px; width: 7vw; color: white"
            text="Close tab"
            :style="{ backgroundColor: stateButtonColor('Maine') }"
            @click="emit('closeTab')"
          ></v-btn>
          <v-btn
            v-if="finalPopup === 'fail'"
            class="cancel-button mr-4 mb-2"
            style="height: 35px; width: 9vw"
            text="Close Popup"
            variant="outlined"
            @click="finalPopup = 'closed'"
          ></v-btn>
        </v-row>
      </template>
    </v-card>
  </v-dialog>
</template>
