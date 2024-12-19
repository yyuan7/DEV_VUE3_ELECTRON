<script setup lang="ts">
import { closeCurrentTag } from '@/renderer/utils/tag/close'
import { useRouter, useRoute } from 'vue-router'
const props = defineProps<{
  state: string // currently selected state
  type: string // either 'edit' or 'add' based on the action. used to determine popup message
}>()

const router = useRouter()
const route = useRoute()

const status = defineModel<boolean>()
</script>

<template>
  <v-dialog v-model="status" max-width="350" overflow="hidden">
    <v-card class="text-center">
      <v-toolbar style="background-color: #bbdbb2">
        <v-icon class="ml-4" size="large" color="#26852a">mdi-check-circle</v-icon>
        <v-card-title>Success!</v-card-title>
      </v-toolbar>
      <v-card-text class="text-center mb-2 pb-0"
        >Rules {{ type === 'edit' ? 'updated' : 'added' }} successfully.</v-card-text
      >
      <template #actions>
        <v-row class="d-flex justify-center">
          <v-btn
            class="cancel-button mr-4 mb-2"
            style="height: 35px; width: 6vw"
            text="Close tab"
            variant="outlined"
            @click="closeCurrentTag(router, route)"
          ></v-btn>
        </v-row>
      </template>
    </v-card>
  </v-dialog>
</template>
