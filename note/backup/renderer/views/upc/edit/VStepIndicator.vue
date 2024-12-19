<template>
  <component :is="getStepComponent" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import EditUPC from '@/renderer/views/upc/edit/VEditUPC.vue'
import EditUpcNext from '@/renderer/views/upc/edit/VEditUPCNext.vue'
import { computed } from 'vue'
const route = useRoute()

// const getStepComponent = () => {}
const getStepComponent = computed(() => {
  if (!route.query.step) {
    return EditUPC
  }
  if (route.query.step === 's2') {
    return EditUpcNext
  } else {
    return EditUPC
  }
})
</script>

<style scoped></style>
