<script setup lang="ts">
import { ref } from 'vue'
import { checkPhoneValidity } from '@/renderer/utils/formatting'
import { VForm } from 'vuetify/components'

const props = defineProps({
  mandatory: String,
  locked: Boolean
})

const name = ref('')
const phone = ref('')
const email = ref('')
const details = ref('')
const form = ref<VForm | null>(null)

const checkInput = (input: string) => {
  if ((!input && props.mandatory) || (!input && (!!phone.value || !!email.value || !!name.value))) {
    return 'Field cannot be blank.'
  }
}

const checkPhone = (number: string) => {
  if (!number) {
    if (props.mandatory || !!name.value || !!email.value) {
      return 'Field cannot be blank'
    }
    return
  }
  const result = checkPhoneValidity(number)
  if (typeof result === 'boolean') {
    return
  }
  return result
}

const runValidation = () => {
  form.value?.validate()
  if (checkInput(name.value) || checkPhone(phone.value) || checkInput(email.value)) {
    return false
  }
  return true
}

const nameRules = [(v: string) => checkInput(v) || true]
const emailRules = [(v: string) => checkInput(v) || true]
const phoneRules = [(v: string) => checkPhone(v) || true]

const getSimpleData = () => {
  return {
    name: name.value,
    phone: phone.value,
    email: email.value,
    details: details.value
  }
}

defineExpose({ runValidation, name, phone, email, details, getSimpleData })
</script>

<template>
  <v-form ref="form" :disabled="locked" width="fit-content">
    <v-card
      class="field rounded-0 border-opacity-0 h-50"
      color="transparent"
      density="compact"
      elevation="0"
    >
      <v-layout row style="min-width: 325px" width="100%">
        <v-card-text class="w-25"> Name: </v-card-text>
        <v-text-field
          v-model="name"
          :bg-color="locked ? 'rgb(153, 153, 153)' : 'white'"
          class="align-end text-box details-box rounded-l"
          clearable
          density="compact"
          placeholder="John Doe"
          :rules="nameRules"
          variant="outlined"
        ></v-text-field>
      </v-layout>
    </v-card>
    <v-card
      class="field rounded-0 border-opacity-0"
      color="transparent"
      density="compact"
      elevation="0"
    >
      <v-layout row style="min-width: 325px">
        <v-card-text class="w-25"> Phone: </v-card-text>
        <v-text-field
          v-model="phone"
          :bg-color="locked ? 'rgb(153, 153, 153)' : 'white'"
          class="align-center text-box rounded-lg"
          clearable
          density="compact"
          placeholder="(123) 456-7890"
          :rules="phoneRules"
          variant="outlined"
        ></v-text-field>
      </v-layout>
    </v-card>
    <v-card class="field rounded-0" color="transparent" density="compact" elevation="0">
      <v-layout row style="min-width: 325px">
        <v-card-text class="w-25"> Email: </v-card-text>
        <v-text-field
          v-model="email"
          :bg-color="locked ? 'rgb(153, 153, 153)' : 'white'"
          class="align-baseline text-box mx-auto rounded-lg"
          clearable
          density="compact"
          placeholder="jdoe@clynk.com"
          :rules="emailRules"
          variant="outlined"
        ></v-text-field>
      </v-layout>
    </v-card>
    <v-card class="field rounded-0" color="transparent" density="compact" elevation="0">
      <v-layout class="shrink" row style="min-width: 325px" width="100%">
        <v-card-text class="w-25"> Details: </v-card-text>
        <v-text-field
          v-model="details"
          :bg-color="locked ? 'rgb(153, 153, 153)' : 'white'"
          class="align-baseline text-box mx-auto rounded-lg"
          clearable
          density="compact"
          placeholder="Job title, etc"
          variant="outlined"
        ></v-text-field>
      </v-layout>
    </v-card>
  </v-form>
</template>

<style scoped>
.text-box {
  padding: 0%;
  height: 7%;
  width: 100%;
}
.field {
  min-height: 0%;
}
</style>
