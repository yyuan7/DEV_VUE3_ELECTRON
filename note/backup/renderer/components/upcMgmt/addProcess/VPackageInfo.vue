<script setup lang="ts">
import { ref, watch } from 'vue'
import { CommonVolumes } from '@/renderer/constants/upc'

// dropdown options provided as props, will be updated with database access
const props = defineProps({
  materials: { type: Array },
  volumes: { type: Array }
})

const checkField = (v) => {
  if (!v || v.length < 1) {
    return
  }
  return true
}

const form = ref(null)
const material = ref('')
const volume = ref('')
const weight = ref<number>(0)
const nameRules = [(v) => checkField(v) || 'Field cannot be blank.']

const calculateWeight = () => {
  // needs logic for calculating weight based on standard values (TBA)
  weight.value = 5
  console.log('should be 5')
}

const validate = () => {
  if (!form.value) return
  form.value.validate()
  return checkField(material.value) && checkField(volume.value) && checkField(weight.value)
}

watch(volume, () => {
  calculateWeight()
})

defineExpose({ validate, material, volume, weight })
</script>

<template>
  <v-container class="stepper-field rounded-lg">
    <v-form ref="form">
      <v-row class="pt-8">
        <v-card-title class="text-start">Material:</v-card-title>
        <v-select
          v-model="material"
          :bg-color="'white'"
          class="pb-8 pl-4"
          :items="materials"
          return-object
          :rules="nameRules"
          style="max-width: 20vw"
          variant="outlined"
        ></v-select>
      </v-row>
      <v-row class="mt-0 pt-0">
        <v-card-title class="ml-4">Volume:</v-card-title>
        <v-combobox
          v-model="volume"
          :bg-color="'white'"
          class="pb-5"
          :items="Object.values(CommonVolumes)"
          return-object
          :rules="nameRules"
          style="max-width: 15vw"
          variant="outlined"
          type="number"
        ></v-combobox>
        <v-card-title>Units:</v-card-title>
        <v-text-field
          :bg-color="'white'"
          class="pb-4"
          disabled
          style="max-width: 10vw"
          variant="outlined"
          >oz.</v-text-field
        >
        <v-card-title>Weight (lbs):</v-card-title>
        <v-text-field
          v-model="weight"
          :bg-color="'white'"
          class="pe-3 pb-4"
          return-object
          :rules="nameRules"
          style="max-width: 15vw"
          type="number"
          variant="outlined"
        ></v-text-field>
      </v-row>
    </v-form>
  </v-container>
</template>

<style scoped>
.stepper-field {
  background-color: rgb(235, 235, 235);
}
</style>
