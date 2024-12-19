<script setup lang="ts">
import { ref } from 'vue'
import { StateType } from '@/renderer/constants/upc'
import { stateButtonColor, stateCardColor } from '@/renderer/utils/stateColorGetter'

const props = defineProps<{
  state: string
  states: string[]
  edit: Boolean
}>()

const selectedStates = ref<Array<{ state: string; selected: boolean }>>([])

const populateSelected = () => {
  if (props.edit) {
    for (const state of Object.values(StateType)) {
      selectedStates.value.push({
        state,
        selected: props.states.includes(state)
      })
    }
  } else {
    for (let i = 0; i < props.states.length; i++) {
      const newState = props.states[i]
      selectedStates.value.push({
        state: newState,
        selected: true
      })
    }
  }
}
populateSelected()

const emit = defineEmits(['blocksave'])
const checkSelected = () => {
  let found = false
  const selected: string[] = []
  for (let i = 0; i < selectedStates.value.length; i++) {
    const item = selectedStates.value[i]
    if (item.selected) {
      selected.push(item.state)
      found = true
    }
  }
  if (!found) {
    emit('blocksave')
    return false
  } else {
    return selected
  }
}

defineExpose({ checkSelected })
</script>

<template>
  <v-btn
    id="state-dropdown"
    :ripple="false"
    flat
    class="rounded-pill mt-6 mr-4 state-marker"
    :style="{ backgroundColor: stateButtonColor(state) }"
    style="color: white"
  >
    {{ state }}
  </v-btn>
  <v-menu activator="#state-dropdown" open-on-hover :close-on-content-click="false">
    <v-list style="min-width: 150px">
      <v-list-item
        :style="{ backgroundColor: stateCardColor(state) }"
        variant="outlined"
        style="border-color: dimgray"
        class="mt-0 pt-0"
      >
        Present In:
      </v-list-item>
      <v-list-item
        v-for="(item, index) in selectedStates"
        :key="index"
        :value="index"
        :disabled="!edit"
      >
        <v-row v-if="edit">
          <v-checkbox v-model="selectedStates[index].selected" :label="item.state" />
        </v-row>
        <v-list-item-title v-if="!edit">{{ item.state }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<style>
@import '@/renderer/styles/lowAdmin.css';
</style>
