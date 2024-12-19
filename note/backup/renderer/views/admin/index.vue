<script setup lang="ts">
import { ref } from 'vue'
import router from '@/renderer/router'
import { StateType } from '@/renderer/constants/upc'
import { checkAdminPermission, checkHighAdminPermission } from '@/renderer/utils/permission'
import { stateButtonColor, backgroundColor } from '@/renderer/utils/stateColorGetter'

const company = ref('')
const showStatePicker = ref(false)
const activeState = ref('')

const loadAction = (action: string) => {
  company.value = action
  showStatePicker.value = true
}

const loadState = (state: string) => {
  activeState.value = state
  router.push({
    path: `/${company.value}`,
    query: { state: activeState.value }
  })
}
</script>

<template>
  <div>
    <v-container
      class="ma-2 container"
      fluid
      :style="{ backgroundColor: backgroundColor('Maine') }"
    >
      <v-card
        class="d-flex flex-column justify-start align-center mt-12 pb-4"
        :style="checkAdminPermission() ? 'height: 65vh;' : 'height: 50vh'"
        style="width: 700px; margin: auto"
      >
        <v-card-title class="text-center mt-8 landing-title">Administrative Actions</v-card-title>
        <v-card-text class="text-center landing-subtitle">Select a field to manage:</v-card-text>

        <!-- Row to hold buttons -->
        <v-row class="d-flex justify-center" style="width: 100%">
          <!-- First two buttons in the same row -->
          <v-btn
            class="lander-button mr-16 pa-0"
            variant="outlined"
            rounded="lg"
            @click="loadAction('manufacturer')"
            ><v-card height="8vh" width="230px" class="lander-btn-text ma-0 pt-7 mx-2" flat
              >Manufacturer</v-card
            ></v-btn
          >
          <v-btn
            class="lander-button ma-0 pa-0"
            variant="outlined"
            rounded="lg"
            @click="loadAction('distributor')"
            ><v-card height="8vh" width="230px" class="lander-btn-text ma-0 pt-7 mx-2" flat
              >Distributor</v-card
            ></v-btn
          >
        </v-row>

        <!-- Third button below the first two -->
        <v-row class="d-flex justify-center" style="width: 100%">
          <v-btn
            class="lander-button mr-16 pa-0"
            variant="outlined"
            rounded="lg"
            @click="loadAction('initiator')"
          >
            <v-card height="8vh" width="230px" class="lander-btn-text ma-0 pt-7 mx-2" flat
              >Initiator</v-card
            >
          </v-btn>
          <v-btn
            class="lander-button ma-0 pa-0"
            variant="outlined"
            rounded="lg"
            @click="loadAction('pickup')"
          >
            <v-card height="8vh" width="230px" class="lander-btn-text ma-0 pt-7 mx-2" flat
              >Pickup Agent</v-card
            >
          </v-btn>
        </v-row>
        <v-row class="justify-center">
          <!-- High Admin ONLY -->
          <v-btn
            v-if="checkHighAdminPermission()"
            class="lander-button pa-0"
            variant="outlined"
            rounded="lg"
            @click="loadAction('fee')"
            ><v-card height="8vh" width="230px" class="lander-btn-text ma-0 pt-7 mx-2" flat
              >Statewide Fees</v-card
            ></v-btn
          >
        </v-row>
      </v-card>
    </v-container>
    <v-dialog v-model="showStatePicker" max-width="500" overflow="hidden" persistent>
      <v-card width="auto" min-height="150px" title="Select a state to work in:">
        <template #actions>
          <v-container>
            <v-row class="d-flex" justify="space-evenly">
              <v-btn
                v-for="state in StateType"
                :key="state"
                variant="outlined"
                class="state-selector mx-1"
                :color="'white'"
                :style="{
                  backgroundColor: stateButtonColor(state),
                  borderColor: '#808080'
                }"
                @click="loadState(state)"
                >{{ state }}</v-btn
              >
            </v-row>
            <v-row class="d-flex">
              <v-btn
                v-if="activeState !== '-'"
                class="justify-end ml-auto mt-4 mr-3 cancel-btn py-0"
                variant="outlined"
                @click="showStatePicker = false"
                >Cancel</v-btn
              >
            </v-row>
          </v-container>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
@import '@/renderer/styles/lowAdmin.css';

.state-selector {
  min-height: 70px;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 110%;
}
</style>
