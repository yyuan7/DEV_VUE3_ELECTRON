<template>
  <v-card class="pa-3 ma-3" elevation="3" color="white">
    <v-card-title class="my-4 text-h4 text-center">
      <span class="flex-fill">Authentication Required </span>
    </v-card-title>
    <v-card-subtitle class="font-italic">
      Authentication is required to perform admin actions.
    </v-card-subtitle>

    <v-avatar size="40">
      <avatar
        :name="userStore.username"
        style="width: 100%; height: 100%; object-fit: cover"
      ></avatar>
    </v-avatar>
    <v-card-subtitle>{{ userStore.username }}</v-card-subtitle>

    <v-card-text>
      <v-form ref="refReAuthForm" v-model="isFormValid" class="text-left" lazy-validation>
        <v-text-field
          ref="refPassword"
          v-model="password"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
          :type="visible ? 'text' : 'password'"
          required
          :error="error"
          :error-messages="errorMessages"
          placeholder="password"
          density="default"
          variant="underlined"
          color="primary"
          bg-color="#fff"
          :readonly="loading"
          :rules="passwordRules"
          name="password"
          outlined
          validate-on="blur"
          @change="resetErrors"
          @click:append-inner="visible = !visible"
          @keyup.enter="handleReAuth"
        ></v-text-field>

        <v-btn
          :loading="loading"
          block
          size="x-large"
          color=""
          class="mt-2"
          @click="closeCurrentTag(router, route)"
          >Cancel
        </v-btn>
        <v-btn
          :loading="loading"
          block
          size="x-large"
          color="primary"
          class="mt-2"
          @click="handleReAuth"
          >Authenticate
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
import { useUserStore } from '@/renderer/store/modules/userStore'
import { useRouter, useRoute } from 'vue-router'
import { closeCurrentTag } from '@/renderer/utils/tag/close'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const snackbarStore = useSnackbarStore()
const refReAuthForm = ref()
const password = ref('')
const isFormValid = ref(true)
const visible = ref(false)
const loading = ref(false)

const error = ref(false)
const errorMessages = ref('')
const resetErrors = () => {
  error.value = false
  errorMessages.value = ''
}

const passwordRules = ref([
  (v: string) => !!v || 'Password is required',
  (v: string) => (v && v.length >= 7) || 'Password must be longer than 7 characters'
])

const handleReAuth = async () => {
  // validate user input format -> validate user data
  const { valid } = await refReAuthForm.value.validate()
  if (valid) {
    loading.value = true
    try {
      await userStore
        .reAuth({
          username: userStore.username,
          password: password.value
        })
        .then(() => {
          closeCurrentTag(router, route)
          router.push({ path: '/admin/index' })
        })
      snackbarStore.showSuccessMessage('Admin access released')
    } catch (error) {
      password.value = ''
      snackbarStore.showErrorMessage('Invalid password')
    }
    loading.value = false
  }
}
</script>

<style scoped></style>
