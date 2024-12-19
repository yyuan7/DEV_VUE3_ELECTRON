<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { stateButtonColor } from '@/renderer/utils/stateColorGetter'
import { VForm } from 'vuetify/components'

const props = defineProps<{
  mainName: String
  mains: string[]
  typeName: String
  types: string[]
  state: string
}>()

// Reactive state variables
const newUpdate = {
  main: ref(''),
  type: ref(''),
  amount: ref(''),
  date: ref(null),
  note: ref('')
}

const emit = defineEmits(['endUpdating'])
const cancel = () => {
  emit('endUpdating')
}

const checkAllFields = () => {
  return (
    !!newUpdate.main.value &&
    !!newUpdate.type.value &&
    !!newUpdate.amount.value &&
    !!newUpdate.date.value &&
    !!newUpdate.note.value
  )
}

const content = ref<VForm | null>(null)

const clearData = () => {
  for (const obj of [newUpdate.main, newUpdate.type, newUpdate.amount, newUpdate.note]) {
    obj.value = ''
  }
  newUpdate.date.value = null
}

const update = () => {
  content.value?.validate()
  if (checkAllFields()) {
    console.log('success')
    emit('endUpdating', newUpdate)
  }
}
</script>

<template>
  <v-container class="fee-card">
    <v-row class="d-flex mb-1">
      <v-card-title class="ma-2 pa-0 fee-update-title">Update Fee</v-card-title>
      <v-btn
        class="ml-auto mt-2 mr-4"
        @click="clearData()"
        :style="{ backgroundColor: stateButtonColor(state) }"
        style="color: white"
        >clear</v-btn
      >
    </v-row>
    <v-form ref="content">
      <v-card-title class="text-start ma-0 pa-0">{{ mainName }}</v-card-title>
      <v-autocomplete
        v-model="newUpdate.main.value"
        density="compact"
        :items="mains"
        return-object
        variant="outlined"
        :bg-color="'white'"
        clearable
        :rules="[(v: string) => !!v || 'Field cannot be blank.']"
      ></v-autocomplete>

      <v-card-title class="text-start ma-0 pa-0">{{ typeName }}</v-card-title>
      <v-select
        v-model="newUpdate.type.value"
        density="compact"
        :items="types"
        return-object
        variant="outlined"
        :bg-color="'white'"
        :rules="[(v: string) => !!v || 'Field cannot be blank.']"
      ></v-select>

      <v-card-title class="text-start ma-0 pa-0">New Fee</v-card-title>
      <v-text-field
        v-model="newUpdate.amount.value"
        density="compact"
        return-object
        variant="outlined"
        :bg-color="'white'"
        :rules="[(v: string) => !!v || 'Field cannot be blank.']"
      >
        <text class="text-h6">¢ </text> &nbsp;
      </v-text-field>

      <v-card-title class="text-start ma-0 pa-0">Activation Date</v-card-title>
      <v-date-input
        v-model="newUpdate.date.value"
        density="compact"
        variant="outlined"
        :bg-color="'white'"
        :rules="[(v: string) => !!v || 'Field cannot be blank.']"
      ></v-date-input>

      <v-card-title class="text-start ma-0 pa-0">Reference Note</v-card-title>
      <v-textarea
        class="ma-0 pa-0 mb-4"
        v-model="newUpdate.note.value"
        no-resize
        placeholder="Reason for update"
        variant="outlined"
        :bg-color="'white'"
        rows="4"
        :rules="[(v: string) => !!v || 'Field cannot be blank.']"
      ></v-textarea>
    </v-form>
    <v-row class="justify-center">
      <v-btn class="mx-2" @click="cancel()">cancel</v-btn>
      <v-btn
        class="mx-2"
        @click="update()"
        :style="{ backgroundColor: stateButtonColor(state) }"
        style="color: white"
        >update</v-btn
      >
    </v-row>
  </v-container>
</template>

<style>
@import '@/renderer/styles/lowAdmin.css';
</style>
