<template>
  <v-app-bar color="primary" density="compact">
    <HeaderCollapse />

    <HeaderLogo />

    <template #append>
      <HeaderUser />
    </template>
  </v-app-bar>
</template>

<script setup lang="tsx">
import { HeaderUser, HeaderLogo, HeaderCollapse } from './tools'
</script>

<style scoped>
.v-btn {
  opacity: 0.4;
}
.active {
  opacity: 1 !important;
}
</style>
