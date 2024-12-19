<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/renderer/store/modules/userStore'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
// import { getTime } from '@utils/time';
import router from '@/renderer/router'

const userStore = useUserStore()
const snackbarStore = useSnackbarStore()
const refLoginForm = ref()
// const email = ref('cat@clynk.com')
// const password = ref('catmeow')
const email = ref('dog@clynk.com')
const password = ref('dogbark')
const isFormValid = ref(true)
const visible = ref(false)
const loading = ref(false)

const error = ref(false)
const errorMessages = ref('')
const resetErrors = () => {
  error.value = false
  errorMessages.value = ''
}

const emailRules = ref([
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'
])

const passwordRules = ref([
  (v: string) => !!v || 'Password is required',
  (v: string) => (v && v.length >= 7) || 'Password must be longer than 7 characters'
])

const handleLogin = async () => {
  // validate user input format -> validate user data
  const { valid } = await refLoginForm.value.validate()
  if (valid) {
    loading.value = true
    try {
      await userStore
        .login({
          username: email.value,
          password: password.value
        })
        .then(() => {
          // Login success
          router.push('/')
        })
      // snackbarStore.showSuccessMessage(`Good ${getTime()}, Welcome Back :)`)
      snackbarStore.showSuccessMessage('Welcome Back :)')
    } catch (error) {
      // Login failed
      password.value = ''
      snackbarStore.showErrorMessage('Invalid email or password')
    }
    loading.value = false
  }
}
</script>

<template>
  <div>
    <!-- <h1>login</h1> -->
    <v-card class="pa-3 ma-3" elevation="3" color="white">
      <v-img
        class="mx-auto my-6"
        max-width="228"
        src="@/renderer/assets/images/logo_green.png"
        alt="Clynk"
      ></v-img>

      <v-card-title class="my-4 text-h4 text-center">
        <span class="flex-fill">Welcome to the Billing Application </span>
      </v-card-title>
      <v-card-subtitle class="font-italic">Login to your account</v-card-subtitle>

      <v-card-text>
        <v-form ref="refLoginForm" v-model="isFormValid" class="text-left" lazy-validation>
          <v-text-field
            ref="refEmail"
            v-model="email"
            prepend-inner-icon="mdi-email-outline"
            required
            :error="error"
            density="default"
            variant="underlined"
            color="primary"
            bg-color="#fff"
            :readonly="loading"
            :rules="emailRules"
            name="email"
            outlined
            validate-on="blur"
            placeholder="dm@clynk.com"
            @change="resetErrors"
            @keyup.enter="handleLogin"
          ></v-text-field>

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
            @keyup.enter="handleLogin"
          ></v-text-field>

          <v-btn
            :loading="loading"
            block
            size="x-large"
            color="primary"
            class="mt-2"
            @click="handleLogin"
            >login</v-btn
          >
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
/* Add any specific styles here */
</style>
