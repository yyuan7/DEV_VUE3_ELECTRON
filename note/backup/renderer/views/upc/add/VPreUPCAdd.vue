<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getUpcInfo } from '@/renderer/api/upc'
import { ResReadUpcList } from '@/renderer/api/upc/type'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
import { closeCurrentTag } from '@/renderer/utils/tag/close'

const router = useRouter()
const snackbarStore = useSnackbarStore()

const handleRoute = (path: string): void => {
  closeCurrentTag(router, route)
  router.push(basePath + path)
}

const dialog = ref(false)
const basePath = '/upc/'
const upc = ref('')
const isLoading = ref(false)

const upcCodeRules = ref([
  (v: string) => (v && v.length > 0 && v.length <= 13) || 'UPC must not exceed 13 digits'
])
const isDisabled = computed(() => !upcCodeRules.value.every((rule) => rule(upc.value) === true))

const findUPC = async () => {
  isLoading.value = true

  try {
    const response: ResReadUpcList = await getUpcInfo(upc.value)

    if (response.code === 201 || response.data.count !== 1) {
      handleRoute(`add/${upc.value}`)
    } else {
      dialog.value = true
    }
  } catch (error) {
    snackbarStore.showErrorMessage(`Search Error: ${error}`)
  } finally {
    isLoading.value = false
  }
}

const route = useRoute()
const goToDash = () => {
  closeCurrentTag(router, route)
  handleRoute(`${upc.value}`)
  dialog.value = false
}
</script>

<template>
  <v-container class="container rounded-lg" fluid>
    <v-card-title class="add-space line-two d-flex justify-center align-center"
      >Enter the UPC you would like to add:</v-card-title
    >
    <v-row class="d-flex justify-center mt-6">
      <v-text-field
        v-model="upc"
        class="search-box rounded-lg"
        density="compact"
        hide-details
        return-object
        variant="outlined"
        :rules="upcCodeRules"
        @keyup.enter="findUPC"
      >
        <template #prependIcon>
          <v-icon class="me-2" color="black" large>mdi-magnify</v-icon>
        </template>
      </v-text-field>

      <v-btn
        class="rounded-lg"
        color="#0a762b"
        depressed
        style="height: 40px; width: 5vw"
        :disabled="isDisabled"
        @click="findUPC"
        >add</v-btn
      >
    </v-row>

    <v-dialog v-model="dialog" max-width="500" overflow="hidden">
      <v-card
        max-width="400"
        prepend-icon="mdi-alert-circle-outline"
        text="This UPC is already in the database."
        title="Known UPC"
      >
        <template #actions>
          <v-row class="d-flex justify-center">
            <v-btn
              class="mr-2 mb-2 cancel-button"
              style="height: 40px; width: 10vw"
              text="Search Again"
              @click="dialog = false"
            ></v-btn>
            <v-btn
              class="me-2"
              color="white"
              style="background-color: #0a762b; height: 40px; width: 10vw"
              text="View Info"
              @click="goToDash()"
            ></v-btn>
          </v-row>
        </template>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
@import '../upcMgmt.css';
.line-two {
  font-weight: 700;
  font-size: 150%;
  font-style: italic;
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
</style>
