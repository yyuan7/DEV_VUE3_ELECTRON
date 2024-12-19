<template>
  <v-empty-state
    headline="Whoops, 404"
    title="Page not found"
    text="The page you were looking for does not exist"
  >
    <v-btn @click="handleClose">Back</v-btn>
  </v-empty-state>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const handleClose = () => router.push('/home')
</script>

<style lang="scss" scoped></style>
