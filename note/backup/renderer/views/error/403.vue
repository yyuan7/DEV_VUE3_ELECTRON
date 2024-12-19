<template>
  <v-empty-state
    headline="Boo, 403"
    title="Forbidden"
    text="The page you were looking for can not access"
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
