<script setup lang="ts">
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
const snackbarStore = useSnackbarStore()
const snackbar = snackbarStore.snackbar

const getIcon = (type: string) => {
  const icon: any = {
    info: 'mdi-information',
    success: 'mdi-check-circle',
    error: 'mdi-alert-circle',
    warning: 'mdi-alert'
  }

  return icon[type]
}
</script>
<template>
  <div>
    <v-snackbar
      v-model="snackbar.isShow"
      :timeout="snackbar.timeout"
      :color="snackbar.type"
      class="elevation-10"
      location="top"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">{{ getIcon(snackbar.type) }}</v-icon>
        <span> {{ snackbar.message }}</span>
      </div>

      <template #actions>
        <v-btn
          icon
          variant="text"
          :disabled="snackbar.timeout === -1 ? true : false"
          @click="snackbar.isShow = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
