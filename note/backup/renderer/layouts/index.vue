<script setup lang="tsx">
import { HeaderLayout, TabBar, AppMain } from './components'
</script>

<template>
  <v-app>
    <v-layout>
      <HeaderLayout />
      <TabBar />

      <v-main>
        <app-main />
      </v-main>
    </v-layout>
  </v-app>
</template>
