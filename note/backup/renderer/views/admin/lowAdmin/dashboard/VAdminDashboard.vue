<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Contact } from '@/renderer/api/common/type'
import { getCompanyInfo, addCompanyNote } from '@/renderer/api/admin/general'
import { Company, ResReadCompanyList } from '@/renderer/api/admin/general/type'
import { getCompanyPickupFee } from '@/renderer/api/admin/high'
import { Fee } from '@/renderer/api/admin/high/type'
import { useUserStore } from '@/renderer/store/modules/userStore'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
import { closeCurrentTag } from '@/renderer/utils/tag/close'
import { titleCapitalize } from '@/renderer/utils/formatting'
import { PickupMaterialType } from '@/renderer/constants/upc'
import VEditableNote from '@/renderer/components/common/VEditableNote.vue'
import ManuStateEdit from '@/renderer/components/admin/VManuStateEdit.vue'
import {
  stateButtonColor,
  stateCardColor,
  backgroundColor,
  tableHeaderColor
} from '@/renderer/utils/stateColorGetter'

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
// Step 1: general company data
const companyData: Company = reactive({ id })

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
        companyData.name = targetCompany.name || ''
        companyData.visible = targetCompany.visible
        companyData.states = targetCompany.states || []
        companyData.physAddress = targetCompany.physAddress || ''
        companyData.invAddress = targetCompany.invAddress || ''
        companyData.notes = targetCompany.notes || []
        // TODO: fetch contact data based on the ID below
        companyData.primaryContactId = targetCompany.primaryContactId || ''
        companyData.secondaryContactId = targetCompany.secondaryContactId || []
        // TODO: will be removed
        companyData.primaryContact = targetCompany.primaryContact || undefined
        companyData.secondaryContact = targetCompany.secondaryContact || []
        companyData.lastUpdatedDate = targetCompany.lastUpdatedDate || ''
        // distributor ONLY
        if (type.toLowerCase() === 'distributor')
          companyData.needsNegRates = targetCompany.needsNegRates

        mergeContacts.value = companyData.primaryContact
          ? [companyData.primaryContact, ...companyData.secondaryContact]
          : companyData.secondaryContact

        console.log(mergeContacts.value)
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

// Step 2: pickup processing fee for distributors ONLY
const pickupData: Fee = reactive({ id, state })

const injectPickup = async () => {
  try {
    const response = await getCompanyPickupFee({ id, state })
    if (response.code === 200) {
      const targetPickupFee = response.data.list.at(0)
      pickupData.glass = targetPickupFee?.glass
      pickupData.metal = targetPickupFee?.metal
      pickupData.plastic = targetPickupFee?.plastic

      console.log(pickupData)
    } else {
      // prevent accessing the pickup processing not exist
      snackbarStore.showErrorMessage(`Loading Failed: ${response.data.message}`)
      closeCurrentTag(router, route)
      router.push({ path: '/404' })
    }
  } catch (error) {
    snackbarStore.showErrorMessage(`Loading Error: ${error}`)
  }
}

onMounted(() => {
  injectData()
  injectPickup()
})
// #endregion

// #region Data Table
const mergeContacts = ref<Contact[]>()
// #endregion

// #region Sumbit New Notes
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

const loadEdit = () => {
  router.push({
    path: `${route.path}/edit`,
    query: { state }
  })
}

const colorRow = (name: string) => {
  if (name === companyData.primaryContact?.name) return 'primary-contact'
}

const negRateMissing = ref<boolean>(false)
const getRate = (material: string) => {
  if (pickupData[material.toLowerCase()]) return pickupData[material.toLowerCase()]
  negRateMissing.value = true
  return ' - '
}
</script>

<template>
  <v-container
    class="ma-2 container rounded-lg"
    fluid
    :style="{ backgroundColor: backgroundColor(state) }"
  >
    <v-row class="d-flex">
      <div>
        <v-icon class="pt-9 pb-6 pl-10" size="35">{{
          companyData.visible ? 'mdi-eye' : 'mdi-eye-off-outline'
        }}</v-icon>
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
        v-if="
          type.toLowerCase() === 'manufacturer' &&
          companyData.states &&
          companyData.states.length > 0
        "
        :state="state"
        :states="companyData.states"
        :edit="false"
      />
      <v-card-text class="ma-0 pa-0 mt-7" style="font-size: 110%">{{ type }}</v-card-text>
      <v-btn
        class="proceed-btn justify-end ma-3 mr-6"
        :style="{ backgroundColor: stateButtonColor(state) }"
        style="color: white"
        @click="loadEdit()"
        >edit</v-btn
      >
    </v-row>
    <hr class="hr-style mt-1" />
    <v-row>
      <v-col cols="8">
        <v-card class="pa-3 ma-2 mb-6" :style="{ backgroundColor: stateCardColor(state) }">
          <v-card-title class="section-titles">Contacts</v-card-title>
          <v-data-table hide-default-footer class="data-table">
            <tr :style="{ backgroundColor: tableHeaderColor(state) }">
              <th class="address-header">Name</th>
              <th class="address-header">Phone</th>
              <th class="address-header">Email</th>
              <th class="address-header">Details</th>
            </tr>
            <tr
              v-for="contact in mergeContacts"
              :key="contact.name"
              :class="colorRow(contact.name)"
            >
              <td class="address-data py-5 ps-5">{{ contact.name }}</td>
              <td class="address-data ps-5">{{ contact.phone }}</td>
              <td class="address-data ps-5">{{ contact.email }}</td>
              <!-- <td class="address-data ps-5">{{ getDetails(contact) }}</td> -->
              <td class="address-data ps-5">{{ contact.details }}</td>
            </tr>
          </v-data-table>
        </v-card>
        <v-card class="pa-3 ma-2" :style="{ backgroundColor: stateCardColor(state) }">
          <v-card-title class="section-titles">Addresses</v-card-title>
          <v-data-table hide-default-footer>
            <tr :style="{ backgroundColor: tableHeaderColor(state) }">
              <th class="address-header">Physical Address</th>
              <th class="address-header">Invoice Address</th>
            </tr>
            <tr>
              <td class="address-data text-center py-2">
                {{ companyData.physAddress }}
              </td>
              <td class="address-data text-center">{{ companyData.invAddress }}</td>
            </tr>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="4">
        <VEditableNote
          v-if="!isLoading"
          :note-data="companyData.notes || []"
          :state="state"
          @add-note="sendNote"
        />
      </v-col>
    </v-row>
    <v-card
      v-if="type.toLowerCase() === 'distributor'"
      class="pa-3 ma-2"
      :style="{ backgroundColor: stateCardColor(state) }"
    >
      <v-card-title class="section-titles"
        >Pickup/Processing Rates (¢){{
          companyData.needsNegRates ? ' - Negotiated' : ''
        }}</v-card-title
      >
      <v-data-table hide-default-footer>
        <tr :style="{ backgroundColor: tableHeaderColor(state) }">
          <th
            v-for="(material, index) in Object.values(PickupMaterialType)"
            :key="index"
            class="address-header"
          >
            {{ material }}
          </th>
        </tr>
        <tr>
          <td
            v-for="(material, index) in Object.values(PickupMaterialType)"
            :key="index"
            class="address-data text-center py-2"
          >
            {{ getRate(material) }}
          </td>
        </tr>
      </v-data-table>
      <v-card-text v-if="negRateMissing" class="ma-0 mt-2 ml-2 pa-0"
        >One or more rates has yet to be negotiated.</v-card-text
      >
    </v-card>
  </v-container>
</template>

<style scoped>
@import '@/renderer/styles/lowAdmin.css';
.dash-section {
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
.section-titles {
  margin: 0;
  padding: 0;
  margin-left: 1%;
  font-size: 150%;
}
</style>
