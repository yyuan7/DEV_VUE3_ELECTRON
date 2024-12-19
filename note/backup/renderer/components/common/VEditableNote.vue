<script setup lang="ts">
import { ref } from 'vue'
import { Note } from '@/renderer/api/common/type'
import { useUserStore } from '@/renderer/store/modules/userStore'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
import { getNotesAsString } from '@/renderer/utils/formatting'
import { stateCardColor, stateButtonColor } from '@/renderer/utils/stateColorGetter'

const userStore = useUserStore()
const snackbarStore = useSnackbarStore()

const props = defineProps<{
  noteData: Note[]
  state: string
}>()

const notes = ref<Note[]>([])

const copyNoteData = () => {
  props.noteData.forEach((note: Note) => {
    notes.value.push({
      username: note.username,
      date: note.date,
      message: note.message
    })
  })
}

copyNoteData()

const noteText = ref('')

const emit = defineEmits(['addNote'])

defineExpose({ notes })
</script>

<template>
  <v-card
    class="ma-2 pl-4 pr-4 ml-0"
    style="min-height: 97%"
    :style="{ backgroundColor: stateCardColor(state) }"
  >
    <v-card-title class="section-titles mt-3">Notes</v-card-title>
    <v-textarea
      :bg-color="'white'"
      readonly
      variant="outlined"
      :model-value="getNotesAsString(notes)"
      rows="14"
      hide-details
      class="pb-6"
      no-resize
    ></v-textarea>
    <v-row>
      <v-textarea
        v-model="noteText"
        :bg-color="'white'"
        placeholder="Type note..."
        variant="outlined"
        no-resize
        rows="2"
        clearable
        class="pr-4 pl-3"
        style="max-width: 350px"
      ></v-textarea>
      <v-btn
        class="mt-10 mr-3 proceed-btn"
        :style="{ backgroundColor: stateButtonColor(state) }"
        style="color: white"
        :disabled="noteText.length === 0"
        @click="emit('addNote', noteText)"
        >add</v-btn
      >
    </v-row>
  </v-card>
</template>

<style scoped>
@import '@/renderer/styles/lowAdmin.css';
</style>
