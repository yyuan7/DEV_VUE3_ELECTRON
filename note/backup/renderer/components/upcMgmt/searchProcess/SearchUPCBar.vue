<!-- TODO -->
<template>
  <v-row class="d-flex justify-center mt-6">
    <v-text-field
      v-model="upc"
      class="search-box rounded-lg"
      density="compact"
      hide-details
      return-object
      variant="outlined"
      :rules="upcCodeRules"
    >
      <v-icon class="me-2" color="black" large> mdi-magnify</v-icon>
    </v-text-field>

    <!-- TODO: disable the button when the upcCodeRules is not satisfied -->
    <v-btn
      :loading="isLoading"
      class="rounded-lg"
      color="#0a762b"
      depressed
      style="height: 40px"
      @click="findUPC"
    >
      <span v-if="!isLoading">find</span>
    </v-btn>
  </v-row>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineExpose } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUpcInfo } from '@/renderer/api/upc'
import { ResReadUpcList } from '@/renderer/api/upc/type'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
import mitt from 'mitt'

// /////////////////////////////////////////////
const $bus = mitt()
// /////////////////////////////////////////////

const router = useRouter()
const route: any = useRoute()
const snackbarStore = useSnackbarStore()

const handleRoute = (path: string): void => {
  router.push(basePath + path)
}

const dialog = ref(false)
const basePath = '/upc/'
const upc = ref('')
const isLoading = ref(false)

const upcCodeRules = ref([(v: string) => (v && v.length <= 13) || 'UPC must not exceed 13 digits'])

const findUPC = async () => {
  isLoading.value = true

  try {
    const response: ResReadUpcList = await getUpcInfo(upc.value)
    console.log(response)
    if (response.code === 201 || response.data.count !== 1) {
      dialog.value = true
    } else {
      // router.push({ path: `/upc/edit/${upc.value}` })
      handleRoute(`edit/${upc.value}`)
    }
  } catch (error) {
    snackbarStore.showErrorMessage(`Search Error: ${error}`)
  } finally {
    isLoading.value = false
    $bus.emit('upc', { upc: upc.value })
    $bus.emit('dialog', { dialog: dialog.value })
  }
}

// const handler = ()=>{
//   $bus.emit('upc',{upc:upc.value});
//   $bus.emit('dialog',{dialog: dialog.value});
// }
</script>

<style scoped>
@import '@/renderer/views/upc/upcMgmt.css';
.line-two {
  font-weight: 700;
  font-size: 150%;
}
.add-space {
  padding-top: 10%;
}
.search-box {
  max-width: 300px;
  width: 25px;
  margin-right: 2%;
  margin-bottom: 0%;
  background-color: white;
}
.search-box {
  max-width: 300px;
  width: 25px;
  margin-right: 2%;
  margin-bottom: 0%;
  background-color: white;
}
</style>
