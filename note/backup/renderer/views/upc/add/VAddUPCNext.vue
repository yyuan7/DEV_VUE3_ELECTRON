<!-- TODO: addToDo & addBilling -->
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/renderer/store/modules/userStore'
import { closeCurrentTag } from '@/renderer/utils/tag/close'
import { addToDoItem } from '@/renderer/api/upc-lists'
import { ToDoItem } from '@/renderer/api/upc-lists/type'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'

const route = useRoute()
const router = useRouter()
const upcCode = route.params.upcCode

// adding item to To-do list
const userStore = useUserStore()
const snackbarStore = useSnackbarStore()
const addToDo = () => {
  if (!upcCode) return
  const newToDoItem: ToDoItem = {
    upcCode,
    state: '',
    userID: userStore.userId,
    status: true
  }
  const test = addToDoItem(newToDoItem)
  console.log(test)
  closeCurrentTag(router, route)
}
const goToDash = () => {
  closeCurrentTag(router, route)
  router.push({ path: `/upc/${upcCode}` })
}
const addBilling = () => {
  closeCurrentTag(router, route)
  try {
    router.push({
      name: 'BR-Add',
      query: {
        state: '',
        upcs: JSON.stringify({ upcs: [upcCode] })
      }
    })
  } catch (error) {
    snackbarStore.showErrorMessage(`Search Error: ${error}`)
  }
}
</script>

<template>
  <v-container class="container rounded-lg" fluid>
    <v-card-title class="d-flex align-center justify-center line-one">
      UPC Record Created!</v-card-title
    >
    <v-card-title class="d-flex justify-center line-two">UPC Code: {{ upcCode }}</v-card-title>
    <v-card-title class="d-flex justify-center line-three">Next Steps:</v-card-title>
    <v-row class="d-flex align-center justify-center">
      <v-btn class="next-step-button rounded-xl" @click="addBilling()">Add billing rules</v-btn>
      <v-btn class="next-step-button rounded-xl" @click="goToDash()">view upc info</v-btn>
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
