<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cloneDeep } from 'lodash-es'
import { Contact } from '@/renderer/api/common/type'
import { getCompanyInfo, updateCompanyInfo, addCompanyNote } from '@/renderer/api/admin/general'
import { Company, ResReadCompanyList } from '@/renderer/api/admin/general/type'
import { useUserStore } from '@/renderer/store/modules/userStore'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
import { closeCurrentTag } from '@/renderer/utils/tag/close'
import { titleCapitalize } from '@/renderer/utils/formatting'
import {
  stateButtonColor,
  stateCardColor,
  backgroundColor,
  tableHeaderColor
} from '@/renderer/utils/stateColorGetter'
import VEditableNote from '@/renderer/components/common/VEditableNote.vue'
import VContactEdit from '@/renderer/components/admin/VContactEditing.vue'
import ManuStateEdit from '@/renderer/components/admin/VManuStateEdit.vue'

const userStore = useUserStore()
const snackbarStore = useSnackbarStore()

// #region Parse Searching Params
const route = useRoute()
const router = useRouter()
// Identify manufacturer / distributor / initiator / pickup agents
const basePath: string = (route.params.action || route.path.split('/')[1]) as string
const type = titleCapitalize(basePath)
// Extract the company ID
const id: string = route.path.split('/')[2] as string
// Identify the state (pass from the search table)
const state: string = route.query.state as string
//  #endregion

// #region Inject Data
const isLoading = ref<Boolean>(true)
const DEFAULT_FORM_DATA: Company = reactive({ id })
const companyData = ref<Company>({ id })
const mergeContacts = ref<Contact[]>()

const injectData = async () => {
  try {
    const response: ResReadCompanyList = await getCompanyInfo({
      id,
      type,
      state
    })
    if (response.code === 200) {
      const targetCompany = response.data.list.at(0)

      if (targetCompany) {
        DEFAULT_FORM_DATA.name = targetCompany.name || ''
        DEFAULT_FORM_DATA.visible = targetCompany.visible
        DEFAULT_FORM_DATA.states = targetCompany.states || []
        DEFAULT_FORM_DATA.physAddress = targetCompany.physAddress || ''
        DEFAULT_FORM_DATA.invAddress = targetCompany.invAddress || ''
        DEFAULT_FORM_DATA.notes = targetCompany.notes || []
        // TODO: fetch contact data based on the ID below
        DEFAULT_FORM_DATA.primaryContactId = targetCompany.primaryContactId || ''
        DEFAULT_FORM_DATA.secondaryContactId = targetCompany.secondaryContactId || []
        // TODO: will be removed
        DEFAULT_FORM_DATA.primaryContact = targetCompany.primaryContact || undefined
        DEFAULT_FORM_DATA.secondaryContact = targetCompany.secondaryContact || []
        DEFAULT_FORM_DATA.lastUpdatedDate = targetCompany.lastUpdatedDate || ''
        // distributor ONLY
        if (type.toLowerCase() === 'distributor')
          DEFAULT_FORM_DATA.needsNegRates = targetCompany.needsNegRates

        companyData.value = cloneDeep(DEFAULT_FORM_DATA)

        mergeContacts.value = DEFAULT_FORM_DATA.primaryContact
          ? [DEFAULT_FORM_DATA.primaryContact, ...DEFAULT_FORM_DATA.secondaryContact]
          : DEFAULT_FORM_DATA.secondaryContact
      } else {
        // prevent accessing the company not exist
        snackbarStore.showErrorMessage(`Loading Failed: ${response.data.message}`)
        closeCurrentTag(router, route)
        router.push({ path: '/404' })
      }
    }
  } catch (error) {
    snackbarStore.showErrorMessage(`Loading Error: ${error}`)
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => injectData())
//  #endregion

// #region Sumbit New Notes -------------------------- TODO: should be done when users click `SAVE CHANGES`
const sendNote = async (noteText) => {
  const message = ref(noteText.trim() as string)
  if (!message.value) {
    snackbarStore.showErrorMessage('Empty Note Message')
    return
  }

  const newNote = {
    message: message.value,
    username: userStore.username,
    date: new Date().toISOString()
  }

  try {
    const response = await addCompanyNote({
      id: id.toString(),
      type,
      state,
      note: newNote
    })
    if (response.code === 200) snackbarStore.showSuccessMessage('Note created successfully')
  } catch (error) {
    snackbarStore.showErrorMessage(`Note Creation Error: ${error}`)
  }
}
//  #endregion

// #region Submit Data
const message = ref('')

const addNote = (noteText) => {
  message.value = noteText.trim() as string
}

const update = async () => {
  if (!message.value) {
    snackbarStore.showErrorMessage('Empty Note Message')
    return
  }

  // Step 1: pack the note into a Note object
  const newNote = {
    message: message.value,
    username: userStore.username,
    date: new Date().toISOString()
  }
  // Step 2: combine all new info
  const updatedData: Company = {
    ...companyData.value,
    notes: [newNote] // Send the new note only, which will be appended to the note history in the backend
  }
  // Step 3: send to the backend
  try {
    const response = await updateCompanyInfo(updatedData)
    console.log(response)

    if (response.code === 200) {
      // Step 4: redirect for success status code
      console.log('success')
      // router.push({
      //   path: `/upc/edit/${upcData.value.upcCode}`,
      //   query: { step: 's2' }
      // })
    } else {
      snackbarStore.showErrorMessage(`Update Failed: ${response.data.message}`)
    }
  } catch (error) {
    snackbarStore.showErrorMessage(`Update Error: ${error}`)
  }
}

const save = () => {
  if (!contactComponent.value) {
    console.warn('Something went wrong with the contact component.')
    return
  }
  const contactStatus = contactComponent.value?.checkSaving()
  if (!scopeSelector.value) {
    if (contactStatus) {
      // to be implemented - sends data to database
      console.log('saving changes! 1')
    } else {
      errorPopupStatus.value = true
      errorPopupMessage = 'Invalid contact data.'
      console.log('save failed!')
    }
  } else {
    const scopeStatus = scopeSelector.value?.checkSelected()
    if (!scopeStatus) {
      errorPopupStatus.value = true
      errorPopupMessage =
        'Company must be present in at least one state. It does not need to be active.'
    } else if (!contactStatus) {
      errorPopupStatus.value = true
      errorPopupMessage = 'Invalid contact data.'
    } else {
      // to be implemented - sends data to database
      console.log('saving changes! 2')
    }
  }
}
//  #endregion

// #region Reset Data
// Reset the address section
const resetAddresses = () => {
  companyData.value.physAddress = DEFAULT_FORM_DATA.physAddress
  companyData.value.invAddress = DEFAULT_FORM_DATA.invAddress
}
//  #endregion

const props = defineProps<{
  data: Company
}>()

const contactComponent = ref<typeof VContactEdit | null>(null)
const scopeSelector = ref<typeof ManuStateEdit | null>(null)

const errorPopupStatus = ref(false)
let errorPopupMessage = ''
</script>

<template>
  <v-container class="ma-2 container" fluid :style="{ backgroundColor: backgroundColor(state) }">
    <v-row class="d-flex">
      <div>
        <v-icon
          class="pt-9 pb-6 pl-10"
          size="35"
          @click="companyData.visible = !companyData.visible"
        >
          {{ companyData.visible ? 'mdi-eye' : 'mdi-eye-off-outline' }}
        </v-icon>
      </div>
      <v-card-title class="ml-4 pb-0 mt-2 mb-2 header">{{ companyData.name }}</v-card-title>
      <div
        v-if="type.toLowerCase() !== 'manufacturer'"
        class="rounded-pill mt-6 mr-4 state-marker"
        :style="{ backgroundColor: stateButtonColor(state) }"
        style="color: white"
      >
        {{ state }}
      </div>
      <ManuStateEdit
        v-if="type.toLowerCase() === 'manufacturer' && !isLoading"
        ref="scopeSelector"
        :state="state"
        :states="companyData.states || []"
        :edit="true"
      />
      <v-card-text class="ma-0 pa-0 mt-7" style="font-size: 110%">{{ type }}</v-card-text>
      <v-btn
        class="justify-end ma-3 mr-6"
        style="color: white"
        :style="{ backgroundColor: stateButtonColor(state) }"
        @click="save()"
        >save changes</v-btn
      >
    </v-row>
    <hr class="hr-style mt-1" />
    <v-row>
      <v-col cols="8">
        <!-- TODO -->
        <VContactEdit
          v-if="!isLoading"
          ref="contactComponent"
          :contacts="mergeContacts || []"
          :primary="companyData.primaryContactId || ''"
          :secondary="data.secondaryContact"
          :state="state"
        />
        <!-- <VContactEdit
          ref="contactComponent"
          :contacts="mergeContacts || []"
          :primary="companyData.primaryContactId || ''"
          :state="state"
        /> -->
        <v-card class="dash-section pa-3 ma-2" :style="{ backgroundColor: stateCardColor(state) }">
          <v-row class="ma-0 pa-0">
            <v-col class="ma-0 pa-0">
              <v-card-title class="section-titles">Addresses</v-card-title>
            </v-col>
            <v-col class="d-flex justify-end ma-0 pa-0">
              <v-btn
                height="30px"
                style="color: white"
                :style="{ backgroundColor: stateButtonColor(state) }"
                @click="resetAddresses()"
                >reset</v-btn
              >
            </v-col>
          </v-row>
          <v-data-table hide-default-footer>
            <tr :style="{ backgroundColor: tableHeaderColor(state) }">
              <th class="address-header">Physical Address</th>
              <th class="address-header">Invoice Address</th>
            </tr>
            <tr>
              <td class="ma-0 pa-0">
                <v-text-field
                  v-model="companyData.physAddress"
                  variant="solo"
                  clearable
                  hide-details
                >
                </v-text-field>
              </td>
              <td class="ma-0 pa-0">
                <v-text-field
                  v-model="companyData.invAddress"
                  variant="solo"
                  clearable
                  hide-details
                >
                </v-text-field>
              </td>
            </tr>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="4">
        <VEditableNote
          v-if="!isLoading"
          :note-data="companyData.notes"
          :state="state"
          @add-note="sendNote"
        />
      </v-col>
    </v-row>
    <v-dialog v-model="errorPopupStatus" max-width="500" overflow="hidden">
      <v-card width="25vw">
        <v-card-title style="background-color: #ffcdcd"
          ><v-icon icon="mdi-alert-circle-outline" class="mr-2" />Save Failed</v-card-title
        >
        <v-card-text>{{ errorPopupMessage }}</v-card-text>
        <template #actions>
          <v-row class="d-flex justify-center">
            <v-btn
              class="me-2 cancel-button"
              style="height: 40px; width: 10vw"
              text="Back"
              variant="outlined"
              @click="errorPopupStatus = false"
            ></v-btn>
          </v-row>
        </template>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
@import '@/renderer/styles/lowAdmin.css';
.hr-style {
  border: 0;
  margin: 1%;
  clear: both;
  display: block;
  width: 98%;
  background-color: #616161c6;
  height: 1px;
}
.state-marker {
  color: white;
  max-height: 24px;
  padding-left: 1%;
  padding-right: 1%;
  margin-right: 2%;
  width: auto;
  text-align: center;
}
.dash-section {
  background-color: #bbdbb2;
  min-height: fit-content;
}
.address-data {
  min-height: 16%;
  font-size: 115%;
  border: 1px solid #898ea1;
}
.address-header {
  color: white;
  font-weight: bold;
  padding: 0.5%;
  font-size: 130%;
  border: 1px solid #898ea1;
}
.data-table {
  max-height: 300px;
}
.primary-contact {
  background-color: #bdbdbd;
}
.second-contact {
  background-color: #e0e0e0;
}
.header {
  font-weight: bold;
  font-size: 175%;
}
</style>
