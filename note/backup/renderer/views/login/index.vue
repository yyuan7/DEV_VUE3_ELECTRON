<template>
  <div class="d-flex text-center flex-grow-1">
    <v-card class="auth-container flex-grow-1 d-flex align-center justify-center d-flex">
      <div class="ma-auto w-full">
        <LoginCard />
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import LoginCard from './LoginCard.vue'
</script>

<style lang="scss" scoped>
.auth-container {
  width: 100%;
  height: 100vh;
  background: url('@/renderer/assets/login/background.jpg') no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
