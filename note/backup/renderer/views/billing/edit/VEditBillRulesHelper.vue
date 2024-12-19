<template>
  <EditBillRules :state="currentState" :rules-being-updated="rules" />
</template>

<script setup lang="ts">
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
import { rule1, rule2 } from '../sampleData'
import EditBillRules from '@/renderer/views/billing/edit/VEditBillRules.vue'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import { BillingRule } from '@/renderer/api/billing/type'

const router = useRouter()
const route = useRoute()
const snackbarStore = useSnackbarStore()
const currentState = ref<string>(route.query.state ? route.query.state.toString() : '-')
const rules = ref<BillingRule[]>(
  route.query.rulesBeingUpdated ? JSON.parse(route.query.rulesBeingUpdated.toString()) : []
)
</script>

<style lang="scss" scoped></style>
