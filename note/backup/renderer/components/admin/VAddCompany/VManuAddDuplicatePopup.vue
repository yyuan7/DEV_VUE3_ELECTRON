<script setup lang="ts">
import { computed } from 'vue'
import { stateButtonColor } from '@/renderer/utils/stateColorGetter'
/*
  total popup varieties (with button options):
  thisState (back, view existing)
  oneOfStates (back, view existing)
  otherState (back, view existing, add new)
  national (back, view existing)
  exists (back, view existing)
  */
const props = defineProps<{
  manuName: string
  state: string
}>()
const status = defineModel<string>()
const open = computed(() => {
  return status.value !== 'none'
})

const getMessage = () => {
  const msg = "The manufacturer '" + props.manuName + "' already exists"
  switch (status.value) {
    case 'thisState':
      return msg + ' in this state.'
    case 'oneOfStates':
      return msg + ' in one of the selected states.'
    case 'otherState':
      return msg + ' in another state.'
    case 'national':
      return msg + ' on a national level.'
    case 'exists':
      return msg + '.'
  }
  return 'Oops, something went wrong. Please try again.'
}

const emit = defineEmits(['proceed', 'goViewRecords'])
</script>

<template>
  <v-dialog v-model="open" :max-width="450" overflow="hidden">
    <v-card class="text-center">
      <v-toolbar style="background-color: #ffcdcd">
        <v-icon class="ml-4" size="large" color="#f44336">mdi-close-circle</v-icon>
        <v-card-title>Duplicate Manufacturer</v-card-title>
      </v-toolbar>
      <v-card-text class="text-center mb-2 pb-0">{{ getMessage() }}</v-card-text>
      <v-card-text class="text-center mb-2 pb-0" v-if="status !== 'otherState'"
        >Add a distinguisher to the name, or edit an existing record.</v-card-text
      >
      <v-card-text class="text-center mb-2 pb-0" v-if="status === 'otherState'">
        Would you like to expand an existing manufacturer to {{ state }}, or add a new one?
      </v-card-text>
      <template #actions>
        <v-col>
          <v-row class="d-flex justify-center ml-10">
            <v-btn
              class="cancel-button mr-4 mb-2"
              style="height: 35px; width: 7vw"
              text="Back"
              variant="outlined"
              @click="status = 'none'"
            ></v-btn>
            <v-btn
              class="cancel-button mr-4 mb-2"
              style="height: 35px; width: 10vw; color: white"
              text="View Existing"
              variant="outlined"
              :style="{ backgroundColor: stateButtonColor('Maine') }"
              @click="
                () => {
                  emit('goViewRecords'), (status = 'none')
                }
              "
            ></v-btn>
          </v-row>
          <v-row v-if="status === 'otherState'">
            <v-btn
              class="mb-2 justify-center mx-auto"
              style="height: 35px; width: 10vw; color: white"
              text="Add New"
              variant="outlined"
              :style="{ backgroundColor: stateButtonColor('Maine') }"
              @click="
                () => {
                  emit('proceed'), (status = 'none')
                }
              "
            >
            </v-btn>
          </v-row>
        </v-col>
      </template>
    </v-card>
  </v-dialog>
</template>
