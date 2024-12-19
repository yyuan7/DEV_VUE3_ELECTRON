<!-- TODO: addBilling + addToDo -->
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { closeCurrentTag } from '@/renderer/utils/tag/close'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'

const route = useRoute()
const router = useRouter()
const upcCode = route.params.upcCode

const basePath = '/upc/'
const handleRoute = (path: string): void => {
  router.push(basePath + path)
}

const addToDo = () => {
  closeCurrentTag(router, route)
  console.log('add to to-do')
  // to be implemented when to-do added
}

const goToDash = () => {
  closeCurrentTag(router, route)
  handleRoute(`${upcCode}`)
}

const snackbarStore = useSnackbarStore()
const addBilling = () => {
  closeCurrentTag(router, route)
  try {
    router.push({
      name: 'BR-Result',
      query: {
        combinedFormData: JSON.stringify({ upcs: [upcCode] })
      }
    })
  } catch (error) {
    snackbarStore.showErrorMessage(`Search Error: ${error}`)
  }
}
</script>

<template>
  <v-container class="container rounded-lg" fluid>
    <v-card-title class="d-flex align-center justify-center line-one"
      >Change Successful!</v-card-title
    >
    <v-card-title class="d-flex justify-center line-two">UPC Code: {{ upcCode }}</v-card-title>
    <v-card-title class="d-flex justify-center line-three">Next Steps:</v-card-title>
    <v-row class="d-flex align-center justify-center">
      <v-btn class="next-step-button rounded-xl" @click="goToDash()">view UPC</v-btn>
      <v-btn class="next-step-button rounded-xl" @click="addBilling()">view affected rules</v-btn>
      <v-btn class="next-step-button rounded-xl" @click="addToDo()">add to to-do</v-btn>
    </v-row>
  </v-container>
</template>

<style scoped>
@import '../upcMgmt.css';
.line-one {
  padding-top: 10%;
  font-weight: 900;
  font-size: 225%;
  text-decoration: underline;
}
.line-two {
  font-weight: 700;
  font-size: 150%;
  font-style: italic;
}
.line-three {
  font-style: italic;
  font-weight: 400;
  font-size: 150%;
}
</style>
