<template>
  <component :is="getStepComponent" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import AddUPC from '@/renderer/views/upc/add/VAddUPC.vue'
import AddUpcNext from '@/renderer/views/upc/add/VAddUPCNext.vue'
import { computed } from 'vue'
const route = useRoute()

// const getStepComponent = () => {}
const getStepComponent = computed(() => {
  if (!route.query.step) {
    return AddUPC
  }
  if (route.query.step === 's2') {
    return AddUpcNext
  } else {
    return AddUPC
  }
})
</script>

<style scoped></style>
