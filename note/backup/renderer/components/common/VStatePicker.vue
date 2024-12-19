<script setup lang="ts">
import { stateButtonColor, secondaryButtonColor } from '@/renderer/utils/stateColorGetter'
import { ref } from 'vue'
import { StateType } from '@/renderer/constants/upc'

const props = defineProps<{
  btnNeeded: Boolean
  initial?: string
}>()

const activeState = ref(props.initial ? props.initial : '-')

const stateSelector = ref(!props.initial)

const emit = defineEmits(['selectState'])

const loadState = (state: string) => {
  console.log(stateSelector.value)
  activeState.value = state
  emit('selectState', state)
  stateSelector.value = false
}
</script>

<template>
  <div>
    <v-btn
      v-if="activeState !== '-' && btnNeeded"
      class="justify-end ml-auto mt-2 mr-6 rounded-pill"
      :style="{
        backgroundColor: stateButtonColor(activeState),
        color: 'white'
      }"
      @click="stateSelector = true"
    >
      {{ activeState }}
      <v-card-text
        class="ma-0 pa-0 ml-2 px-2 py-1 rounded-pill"
        :style="{ backgroundColor: secondaryButtonColor(activeState) }"
        >switch</v-card-text
      >
    </v-btn>
    <v-dialog v-model="stateSelector" max-width="500" overflow="hidden" persistent>
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
                @click="stateSelector = false"
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
.cancel-btn {
  background-color: #bdbdbd;
}
</style>
