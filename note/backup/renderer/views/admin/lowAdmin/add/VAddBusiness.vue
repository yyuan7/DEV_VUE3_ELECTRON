<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCompanyInfo, addCompanyInfo } from '@/renderer/api/admin/general'
import { Company, ResReadCompanyList, ReqCreateOrUpdateCompany } from '@/renderer/api/admin/general/type'
import { Note, Contact } from '@/renderer/api/common/type'
import { useUserStore } from '@/renderer/store/modules/userStore'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
import { closeCurrentTag } from '@/renderer/utils/tag/close'
import { titleCapitalize } from '@/renderer/utils/formatting'
import { backgroundColor, stateButtonColor } from '@/renderer/utils/stateColorGetter'
import AddBusinessData from '@/renderer/components/admin/VAddCompany/AddBusinessData.vue'
import StatePicker from '@/renderer/components/common/VStatePicker.vue'
import FinalPopup from '@/renderer/components/admin/VAddCompany/VFinalPopup.vue'

const snackbarStore = useSnackbarStore()
const userStore = useUserStore()

// #region Parse Searching Params
const route = useRoute()
const router = useRouter()
// Identify manufacturer / distributor / initiator / pickup agents
const basePath: string = (route.params.action || route.path.split('/')[1]) as string
const type = titleCapitalize(basePath)
// Identify the state (pass from the search table)
const state = ref((route.query.state as string) || '')
//  #endregion

// #region Verify Duplication
const name = ref('')
const verified = ref(false)
const duplicateAlert = ref<boolean>(false)
const duplicateID = ref<number>(0)

// Restrict users to verify again if name change
const checkData = () => {
  verified.value = false
  return true
}
const watchNameChange = [() => checkData() || 'not possible']

const verifyDuplication = async () => {
  try {
    const response: ResReadCompanyList = await getCompanyInfo({
      name: name.value,
      type,
      state: state.value
    })
    if (response.code === 201) {
      // Case no-duplication: proceed to the next step
      verified.value = true
    } else {
      // Case duplication: show pop-up
      duplicateID.value =  parseInt(response.data.list[0].id as string) || 0;
      duplicateAlert.value = true
    }
  } catch (error) {
    snackbarStore.showErrorMessage(`Verify Duplication Error: ${error}`)
  }
}

const EditView = () => {
  // need to save the duplicate record found, and in this function, switch to editing that record
  router.push({
    path: '/' + basePath + '/' + duplicateID.value + '/edit',
    query: { state : state.value }
  });
}
//  #endregion

// #region Add the Company Info to the Backend
const save = async (data) => {

  // Step 1. receive company info from AddBusinessData
  const newNote : Note = {
    message: data.noteMsg,
    username: userStore.username,
    date: new Date().toISOString()
  }

  const formData = ref<ReqCreateOrUpdateCompany>({
    name: name.value,
    visible: data.visible,
    states: [state.value],
    addedByUserId: userStore.userId,
    physAddress: data.physical,
    invAddress: data.invoice,
    notes: newNote.message.length > 0 ? [newNote] : [],
    primaryContact: data.primary,
    secondaryContact: data.secondary.name !== "" ? [data.secondary] : [], // optional
    lastUpdatedDate: new Date().toISOString(),
    needsNegRates: data.useNegRates,
    type
  })

  console.log(formData.value)

  // Step 2. send & store in DB
  try {
    const response = await addCompanyInfo(formData.value)
    if (response.code === 200) {
      finalPopup.value = 'success'
    } else {
      finalPopup.value = 'fail'
    }
  } catch (error) {
    snackbarStore.showErrorMessage(`Create Business Error: ${error}`)}
}
//  #endregion

// #region PopUp Success Message
const finalPopup = ref<string>('closed')
//  #endregion

const loadState = (selection: string) => {
  state.value = selection
}
</script>

<template>
  <v-container class="ma-2 container" fluid :style="{ backgroundColor: backgroundColor(state) }">
    <v-container class="align-center justify-center entry-box" height="fit-content">
      <StatePicker :btn-needed="false" :initial="state" @select-state="loadState" />
      <v-row class="d-flex ma-0">
        <v-card-title class="text-center justify-center ml-auto">Add {{ type }}</v-card-title>
        <div
          class="d-flex state-marker rounded-pill mr-0 ml-auto justify-center"
          :style="{ backgroundColor: stateButtonColor(state) }"
        >
          {{ state }}
        </div>
      </v-row>
      &nbsp;
      <v-form class="text-center">
        <v-row class="justify-center">
          <v-text-field
            ref="input"
            v-model="name"
            :bg-color="'white'"
            class="init-name rounded-lg"
            clearable
            density="compact"
            :placeholder="`Enter ${type} Name`"
            :rules="watchNameChange"
            variant="outlined"
          ></v-text-field>
          &nbsp; &nbsp;
          <v-btn
            :style="{ backgroundColor: stateButtonColor(state) }"
            style="color: white"
            @click="verifyDuplication()"
            >Verify</v-btn
          >
        </v-row>
        <text :class="verified ? 'text-white' : 'text-red'">Verify name to proceed.</text>
      </v-form>
      <AddBusinessData
        :disabled="!verified"
        :distributor="type.toLowerCase() === 'distributor'"
        :btn-msg="'CANCEL'"
        :state="state"
        @try-save="save"
        @cancel="closeCurrentTag(router, route)"
      />
    </v-container>
    <FinalPopup v-model="finalPopup" :type="type" @close-tab="closeCurrentTag(router, route)" />
    <v-dialog
      v-model="duplicateAlert"
      :max-width="finalPopup === 'success' ? 350 : 450"
      overflow="hidden"
    >
      <v-card class="text-center">
        <v-toolbar style="background-color: #fff3cd">
          <v-icon class="ml-4" size="large" color="#9b8015">mdi-alert-circle</v-icon>
          <v-card-title>Duplicate Record</v-card-title>
        </v-toolbar>
        <v-card-text class="text-center mb-2 pb-0"
          >The {{ type }} {{ name }} already exists in the state of {{ state }}.</v-card-text
        >
        <v-card-text class="text-center mb-2 pb-0"
          >Would you like to edit its information?</v-card-text
        >
        <template #actions>
          <v-row class="d-flex justify-center">
            <v-btn
              class="cancel-button mr-4 mb-2"
              style="height: 35px; width: 6vw"
              text="Cancel"
              variant="outlined"
              @click="duplicateAlert = false"
            ></v-btn>
            <v-btn
              class="cancel-button mr-4 mb-2"
              style="height: 35px; width: 9vw; color: white"
              text="Edit Record"
              :style="{ backgroundColor: stateButtonColor(state) }"
              @click="EditView"
            ></v-btn>
          </v-row>
        </template>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style>
@import '@/renderer/styles/lowAdmin.css';
.init-name {
  max-width: 350px;
}
.entry-box {
  width: fit-content;
  background-color: white;
}
.text-box {
  padding: 0%;
  width: 350px;
  height: 7%;
}
.state-marker {
  color: white;
  max-height: 24px;
  padding-left: 1%;
  padding-right: 1%;
  margin-right: 2%;
  max-width: fit-content;
}
</style>
