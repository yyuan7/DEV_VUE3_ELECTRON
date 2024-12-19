<template>
  <div>
    <UPCDashRules :state="state" :missing-data="!upcData.completeUPCInfo" :upc="upcData" />
  </div>
</template>

<script setup lang="ts">
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
import { partyPoison } from './sampleData'
import UPCDashRules from './VUPCDashRules.vue'
import { useRouter, useRoute } from 'vue-router'
import { ResReadUpcList, UpcData } from '@/renderer/api/upc/type'
import { getUpcInfo } from '@/renderer/api/upc'
import { MaterialType, BeverageType } from '@/renderer/constants/upc'
import { closeCurrentTag } from '@/renderer/utils/tag/close'
import { reactive, onMounted } from 'vue'

const router = useRouter()
const route = useRoute()

const state = route.query.state ? route.query.state?.toString() : '-'

// #region Inject UPC Data
const snackbarStore = useSnackbarStore()

const upcData: any = reactive({})

const injectData = async () => {
  const upcCode = route.query.upcCode
  upcData.code = upcCode as string

  try {
    const response: ResReadUpcList = await getUpcInfo(upcCode as string)
    if (response.code === 200) {
      const targetUpc = response.data.list.at(0)

      if (targetUpc) {
        upcData.code = parseInt(targetUpc.upcCode)
        upcData.name = targetUpc.name || ''
        upcData.manufacturer = targetUpc.manufacturer || undefined
        upcData.material = (targetUpc.material as MaterialType) || undefined
        upcData.beverageType = (targetUpc.beverageType as BeverageType) || undefined
        upcData.volumeSize = targetUpc.volumeSize || undefined
        upcData.weight = targetUpc.weight || undefined
        upcData.firstScanDate = targetUpc.firstScanDate || ''
        upcData.lastScanDate = targetUpc.lastScanDate || ''
        upcData.totalScanUnit = targetUpc.totalScanUnit || undefined
        upcData.notes = targetUpc.notes || []
        upcData.completeUPCInfo = targetUpc.completeUPCInfo || false
      } else {
        // prevent accessing UPC not exist
        snackbarStore.showErrorMessage(`Search Failed: ${response.data.message}`)
        closeCurrentTag(router, route)
        router.push({ path: '/404' })
      }
    }
  } catch (error) {
    snackbarStore.showErrorMessage(`Search Error: ${error}`)
  }
}

onMounted(() => injectData())
//  #endregion
</script>

<style lang="scss" scoped></style>
