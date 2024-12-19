<script setup lang="ts">
import { backgroundColor } from '@/renderer/utils/stateColorGetter'

const loadAction = (action: string) => {
  switch (action) {
    case 'handling':
      console.log('loading handling fee pg')
      return
    case 'deposit':
      console.log('loading deposit fee pg')
      return
    case 'pickup':
      console.log('loading pickup fee pg')
  }
}
</script>

<template>
  <v-container class="ma-2 container" fluid :style="{ backgroundColor: backgroundColor('Maine') }">
    <v-card
      class="d-flex flex-column justify-start align-center mt-16"
      style="height: 50vh; width: 700px; margin: auto"
    >
      <v-card-title class="text-center mt-8 landing-title">Manage Statewide Fees</v-card-title>
      <v-card-text class="text-center landing-subtitle">Select fees to manage:</v-card-text>

      <!-- Row to hold buttons -->
      <v-row class="d-flex justify-center" style="width: 100%">
        <!-- First two buttons in the same row -->
        <v-btn
          class="lander-button mr-16 pa-0"
          variant="outlined"
          rounded="lg"
          @click="loadAction('deposit')"
          ><v-card height="8vh" width="230px" class="lander-btn-text ma-0 pt-7 mx-2" flat
            >Handling Fees</v-card
          ></v-btn
        >
        <v-btn
          class="lander-button ma-0 pa-0"
          variant="outlined"
          rounded="lg"
          @click="loadAction('deposit')"
          ><v-card height="8vh" width="230px" class="lander-btn-text ma-0 pt-7 mx-2" flat
            >Deposit Fees</v-card
          ></v-btn
        >
      </v-row>

      <!-- Third button below the first two -->
      <v-row class="d-flex justify-center" style="width: 100%">
        <v-btn
          class="lander-button ma-0 pa-0"
          @click="loadAction('pickup')"
          variant="outlined"
          rounded="lg"
        >
          <v-card height="8vh" width="250px" class="lander-btn-text ma-0 pt-7 mx-2" flat
            >Pickup/Processing Fees</v-card
          >
        </v-btn>
      </v-row>
    </v-card>
  </v-container>
</template>

<style scoped>
@import '@/renderer/styles/lowAdmin.css';
</style>
