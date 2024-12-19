<template>
  <div> hi </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { reqLogin } from '@/renderer/api/login'
// import { reqLogin, reqUserToken, reqUserInfo, reqLogout } from '@/renderer/api/login'

onMounted(() => {
  reqLogin({
    username: 'cat@clynk.com',
    password: 'catmeow'
  })
  // reqUserToken()
  // reqUserInfo({})
  // reqLogout({})
})
</script>

<style lang="scss" scoped></style>
