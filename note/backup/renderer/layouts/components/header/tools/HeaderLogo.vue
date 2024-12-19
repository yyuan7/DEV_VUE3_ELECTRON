<template>
  <div class="logo">
    <img src="@/renderer/assets/logo.png" :alt="name" />
  </div>
</template>

<script setup lang="ts">
import { name } from '@/../package.json'
</script>

<style lang="scss" scoped>
.logo {
  width: 100%;
  height: 45px;
  color: white;
  display: flex;
  align-items: center;
  padding: 7.5px;
  display: flex;
  justify-content: center;

  img {
    height: 30px;
    width: auto;
    // margin-left: 10px
  }
}
</style>
