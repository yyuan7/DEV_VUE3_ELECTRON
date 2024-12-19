<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getUpcInfo } from '@/renderer/api/upc'
import { ResReadUpcList } from '@/renderer/api/upc/type'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'

const router = useRouter()
const snackbarStore = useSnackbarStore()

const handleRoute = (path: string): void => {
  router.push(basePath + path)
}

const dialog = ref(false)
const basePath = '/upc/'
const upc = ref('')
const isLoading = ref(false)

const upcCodeRules = ref([
  (v: string) => (v && v.length >= 1 && v.length <= 13) || 'UPC must not exceed 13 digits'
])
const isDisabled = computed(() => !upcCodeRules.value.every((rule) => rule(upc.value) === true))

const findUPC = async () => {
  isLoading.value = true

  try {
    const response: ResReadUpcList = await getUpcInfo(upc.value)
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
  }
}

const goToAdd = () => {
  const path = upc.value === '' ? 'index' : upc.value
  handleRoute(`add/${path}`)
  dialog.value = false // Fixed the variable name to match
}

const goToSearch = () => {
  handleRoute('search')
}
</script>

<template>
  <v-container class="container rounded-lg" fluid>
    <v-card-title class="add-space line-two d-flex justify-center align-center"
      >Enter the UPC you would like to edit:</v-card-title
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
        <v-icon class="me-2" color="black" large> mdi-magnify</v-icon>
      </v-text-field>

      <v-btn
        :loading="isLoading"
        class="rounded-lg"
        color="#0a762b"
        depressed
        style="height: 40px"
        :disabled="isDisabled"
        @click="findUPC"
      >
        <span v-if="!isLoading">find</span>
      </v-btn>
    </v-row>

    <v-col class="pt-16">
      <v-card-title class="d-flex justify-center" style="font-weight: 400; font-style: italic"
        >Not Sure?</v-card-title
      >
      <div class="d-flex justify-center">
        <v-btn class="cancel-button" @click="goToSearch()">Take me to search</v-btn>
      </div>
    </v-col>

    <v-dialog v-model="dialog" max-width="500" overflow="hidden">
      <v-card
        max-width="400"
        prepend-icon="mdi-alert-circle-outline"
        text="This UPC is not in the database."
        title="UPC Not Found"
      >
        <template #actions>
          <v-row class="d-flex justify-center">
            <v-btn
              class="me-2 cancel-button"
              style="height: 40px; width: 10vw"
              text="Search Again"
              variant="outlined"
              @click="dialog = false"
            ></v-btn>
            <v-btn
              class="mr-2 mb-2"
              color="white"
              style="background-color: #0a762b; height: 40px; width: 10vw"
              text="Add UPC"
              @click="goToAdd()"
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
