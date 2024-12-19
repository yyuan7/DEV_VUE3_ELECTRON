<template>
  <v-app>
    <router-view />
    <snackbar />
  </v-app>
</template>

<script setup lang="ts">
import Snackbar from '@/renderer/components/common/SnackBar.vue'
</script>

<style lang="scss" scoped></style>
