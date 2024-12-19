<!-- TODO: volume range change -> according to Dan, we should provide a volume range and users can also type their own value.
 For example, users may enter 10.00 which will be stored as 10, waiving the digits. -->
<!-- TODO: weight range change -> the weight should be auto-calculated based on volume -->
<template>
  <v-container class="container" fluid>
    <v-stepper-vertical eager>
      <template #default="{ step }">
        <!------------------------------ Product information ------------------------------>
        <v-stepper-vertical-item :complete="step > 1" title="Enter Product Information" value="1">
          <VProductInfo ref="prodInfo" :beverages="Object.values(BeverageType)" />

          <!-- next/prev buttons -->
          <template #next="{ next }">
            <v-btn color="primary" @click="productNext(next)"></v-btn>
          </template>

          <template #prev></template>
        </v-stepper-vertical-item>

        <!----------------------------- Packaging information ----------------------------->
        <v-stepper-vertical-item :complete="step > 2" title="Enter Packaging Information" value="2">
          <VPackageInfo ref="pkgInfo" :materials="Object.values(MaterialType)" />

          <!-- next/prev buttons -->
          <template #next="{ next }">
            <v-btn color="primary" @click="packageNext(next)"></v-btn>
          </template>

          <template #prev="{ prev }">
            <v-btn variant="plain" @click="prev">back</v-btn>
          </template>
        </v-stepper-vertical-item>

        <!----------------------------------- Note Field ---------------------------------->
        <v-stepper-vertical-item :complete="noteCompletion" title="Leave a Note" value="3">
          <div> Where was this UPC discovered? Where was the product information found? </div>
          <v-textarea
            ref="noteArea"
            v-model="newUPCData.note.value"
            placeholder="e.g. Found in Maine Registry. Product information from Trader Joe's website."
            variant="outlined"
          >
          </v-textarea>
          <div v-if="noteStatus.value" style="color: red"> Note cannot be blank. </div>

          <!-- next/prev buttons -->
          <template #next="{ next }">
            <v-btn color="primary" @click="noteNext(next)"></v-btn>
          </template>

          <template #prev="{ prev }">
            <v-btn variant="plain" @click="prev">back</v-btn>
          </template>
        </v-stepper-vertical-item>

        <!------------------------------- Confirmation Page ------------------------------->
        <v-stepper-vertical-item title="Confirm Product Information" value="4" @click:next="addUpc">
          <VConfirmData :data="newUPCData" :upc="upcCode" />

          <!-- next/prev buttons -->
          <template #next="{ next }">
            <v-btn color="primary" text="Finish" @click="next"></v-btn>
          </template>

          <template #prev="{ prev }">
            <v-btn v-if="!finished" variant="plain" @click="prev">back</v-btn>

            <v-btn v-else text="Reset" variant="plain" @click="finished = false"></v-btn>
          </template>
        </v-stepper-vertical-item>
      </template>
    </v-stepper-vertical>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { addUpcInfo } from '@/renderer/api/upc'
import { UpcData } from '@/renderer/api/upc/type'
import { Note } from '@/renderer/api/common/type'
import { BeverageType, MaterialType } from '@/renderer/constants/upc'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
import { useUserStore } from '@/renderer/store/modules/userStore'
import { VStepperVertical, VStepperVerticalItem } from 'vuetify/labs/VStepperVertical'
import VProductInfo from '@/renderer/components/upcMgmt/addProcess/VProductInfo.vue'
import VPackageInfo from '@/renderer/components/upcMgmt/addProcess/VPackageInfo.vue'
import VConfirmData from '@/renderer/components/upcMgmt/addProcess/VConfirmData.vue'

const route = useRoute()
const router = useRouter()
const upcCode = route.params.upcCode as string
const snackbarStore = useSnackbarStore()
const userStore = useUserStore()

// #region Default Original Data
const newData = ref<UpcData>({
  upcCode: upcCode as string,
  name: '',
  manufacturer: '',
  material: undefined,
  beverageType: undefined,
  volumeSize: undefined,
  weight: undefined,
  notes: []
})
//  #endregion

// #region Add the UPC info to the backend
const addUpc = async () => {
  // Step 1: pack the note into a Note object
  const newNote: Note = {
    message: newUPCData.note.value.trim(),
    username: userStore.username,
    date: new Date().toISOString()
  }
  // Step 2: inject all data into the upcData format
  newData.value.name = newUPCData.finalName.value
  newData.value.manufacturer = newUPCData.finalManu.value
  newData.value.material = newUPCData.finalMaterial.value
  newData.value.beverageType = newUPCData.finalType.value
  newData.value.volumeSize = newUPCData.finalVolume.value
  newData.value.weight = newUPCData.finalWeight.value

  const combinedData: UpcData = {
    ...newData.value,
    notes: [newNote]
  }

  // Step 3: send to the backend
  try {
    const response = await addUpcInfo(combinedData)

    if (response.code === 200) {
      // Step 4: redirect for success status code
      router.push({
        path: `/upc/add/${upcCode}`,
        query: { step: 's2' }
      })
    } else {
      snackbarStore.showErrorMessage(`Add Failed: ${response.data.message}`)
    }
  } catch (error) {
    snackbarStore.showErrorMessage(`Add Error: ${error}`)
  }
}
//  #endregion

// //////////////////////////////////////////////////////////////////

const prodInfo = ref<typeof VProductInfo>()
const pkgInfo = ref<typeof VPackageInfo>()
const noteArea = ref(null)

const finished = ref(false)
const newUPCData = {
  // UPC will be shipped to database in parent file
  note: ref(''),
  finalName: ref(''), // data types will be updated with database access
  finalManu: ref(''),
  finalType: ref(undefined),
  finalVolume: ref(undefined),
  finalWeight: ref(undefined),
  finalMaterial: ref(undefined)
}
const noteStatus = ref(false)
const noteCompletion = ref(false)

const productNext = (next) => {
  if (!prodInfo.value) return
  if (checkValid(prodInfo.value.validate(), next)) {
    newUPCData.finalName.value = prodInfo.value.name ? prodInfo.value.name : ''
    newUPCData.finalManu.value = prodInfo.value.manufacturer
    newUPCData.finalType.value = prodInfo.value.type
  }
}
const packageNext = (next) => {
  if (!pkgInfo.value) return
  if (checkValid(pkgInfo.value.validate(), next)) {
    newUPCData.finalMaterial.value = pkgInfo.value.material
    newUPCData.finalVolume.value = pkgInfo.value.volume
    newUPCData.finalWeight.value = pkgInfo.value.weight
  }
}
const noteNext = (next) => {
  if (newUPCData.note.value && newUPCData.note.value.length > 0) {
    noteStatus.value = false
    noteCompletion.value = true
    next()
  } else {
    noteStatus.value = true
    noteCompletion.value = false
  }
}
const checkValid = (validation, next) => {
  if (validation) {
    next()
    return true
  } else {
    return false
  }
}
</script>

<style scoped>
@import '../upcMgmt.css';
</style>
