<template>
  <div class="d-flex text-center flex-grow-1">
    <v-card class="auth-container flex-grow-1 d-flex align-center justify-center d-flex">
      <div class="ma-auto w-full">
        <AuthCard />
      </div>
    </v-card>
  </div>
</template>

<script setup>
import AuthCard from './AuthCard.vue'
</script>

<style lang="scss" scoped>
.auth-container {
  width: 100%;
  height: 90vh;
  background: #d3f1df;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
