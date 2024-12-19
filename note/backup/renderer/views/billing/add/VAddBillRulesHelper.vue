<template>
  <AddBillRules :state="'Connecticut'" :upcs-getting-rules="[partyPoison, milkTea]" />
</template>

<script setup lang="ts">
import AddBillRules from '@/renderer/views/billing/add/VAddBillRules.vue'
import { partyPoison, milkTea } from '../sampleData'
</script>

<style lang="scss" scoped></style>
