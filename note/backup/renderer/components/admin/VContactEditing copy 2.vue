<!-- Next: The current progress is to receive all contact info + primaryContactId + state. Next is to update by removing newSecondary -->
<!-- bc the old structure is 1 primary + 1 second + others -->
<script setup lang="ts">
import { ref } from 'vue'
import { Contact } from '@/renderer/api/common/type'
import { checkPhoneValidity } from '@/renderer/utils/formatting'
import {
  stateButtonColor,
  stateCardColor,
  backgroundColor
} from '@/renderer/utils/stateColorGetter'

const props = defineProps<{
  contacts: Contact[]
  primary: string
  state: string
}>()

const updatedContacts = ref<Contact[]>([])
// TODO: string -> number
const newPrimary = ref<Number>(0)
const newSecondary = ref<Number | null>(0)
const selected = ref<Contact>(props.contacts[0])
const newName = ref<string>('')
const newPhone = ref<string>('')
const newEmail = ref<string>('')
const newDetails = ref<string>('')

const reset = () => {
  updatedContacts.value = []
  props.contacts.forEach((contact) => {
    const copy = {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      details: contact.details
    }
    updatedContacts.value.push(copy)
  })
  // TODO: string -> number
  newPrimary.value = parseInt(props.primary)
  newSecondary.value = props.secondary
  selected.value = updatedContacts.value[0]
  newName.value = selected.value.name
  newPhone.value = selected.value.phone
  newEmail.value = selected.value.email
  newDetails.value = selected.value.details
}

reset()

const contactRules = [
  (v: string) => newPrimary.value !== newSecondary.value || 'Invalid selection.'
]

const checkSelected = (item: Contact) => {
  if (selected.value && selected.value.id && item && item.id) {
    return selected.value.id === item.id
  }
  return false
}

const getField = (field: string) => {
  if (!selected.value) return
  switch (field) {
    case 'name':
      return selected.value.name
    case 'phone':
      return selected.value.phone
    case 'email':
      return selected.value.email
    case 'details':
      return selected.value.details
  }
}

const fields = [
  {
    name: 'Name:',
    type: 'name',
    bind: newName,
    rules: [(v: string) => !!v || 'Required field.']
  },
  {
    name: 'Phone:',
    type: 'phone',
    bind: newPhone,
    rules: [(v: string) => checkPhoneValidity(v) || 'Required field.']
  },
  {
    name: 'Email:',
    type: 'email',
    bind: newEmail,
    rules: [(v: string) => !!v || 'Required field.']
  },
  {
    name: 'Details:',
    type: 'details',
    bind: newDetails,
    rules: [(v: string) => true]
  }
]

const findContactById = (id: number) => {
  for (let index = 0; index < updatedContacts.value.length; index++) {
    const item = updatedContacts.value[index]
    if (item.id === id) return index
  }
  return -1
}

const recordNewData = (destination: Contact) => {
  destination.name = newName.value
  destination.phone = newPhone.value
  destination.email = newEmail.value
  destination.details = newDetails.value
}

const saveUpdatedInfo = () => {
  if (!checkSaving()) console.warn('Invalid text entry.')
  const toUpdate = updatedContacts.value[findContactById(selected.value.id)]
  if (toUpdate) {
    recordNewData(toUpdate)
  } else {
    recordNewData(selected.value)
    updatedContacts.value.push(selected.value)
  }
}

const selectContact = (item: Contact) => {
  selected.value = item
  newName.value = selected.value.name
  newPhone.value = selected.value.phone
  newEmail.value = selected.value.email
  newDetails.value = selected.value.details
}

const getNextId = () => {
  return Math.random()
}

const createContact = () => {
  // not sure how keys are generated in database currently - will be updated!
  const newContact = {
    id: getNextId(),
    name: '',
    email: '',
    phone: '',
    details: ''
  }
  selectContact(newContact)
}

const deleteSelected = () => {
  if (updatedContacts.value.length === 1) {
    console.warn('Cannot have zero contacts.')
    return
  }
  const index = findContactById(selected.value.id)
  if (index < 0) {
    console.log('no')
    selectContact(updatedContacts.value[0])
    return
  }
  updatedContacts.value.splice(index, 1)
  const deletedId = selected.value.id

  if (index === updatedContacts.value.length) {
    selectContact(updatedContacts.value[updatedContacts.value.length - 1])
  } else {
    selectContact(updatedContacts.value[index])
  }
  if (newPrimary.value === deletedId) {
    newPrimary.value = updatedContacts.value[0].id
  } else if (newSecondary.value === deletedId) {
    newSecondary.value = null
  }
}

const infoInputField = ref(null)

const checkSaving = () => {
  return newPrimary.value !== newSecondary.value
  // add alert if you have unsaved contact data, maybe?
}

defineExpose({ newPrimary, newSecondary, updatedContacts, checkSaving })
</script>

<template>
  <v-card class="dash-section pa-3 ma-2 mb-6" :style="{ backgroundColor: stateCardColor(state) }">
    <v-row class="ma-0 pa-0">
      <v-col class="ma-0 pa-0">
        <v-card-title class="section-titles">Contacts</v-card-title>
      </v-col>
      <v-col class="d-flex justify-end ma-0 pa-0">
        <v-btn
          height="30px"
          style="color: white"
          :style="{ backgroundColor: stateButtonColor(state) }"
          @click="reset()"
          >reset</v-btn
        >
      </v-col>
    </v-row>
    <v-row class="mt-0 pt-0">
      <v-card-text class="sub-titles mr-5 pr-0" style="max-width: fit-content"
        >Primary Contact:</v-card-text
      >
      <v-select
        v-model="newPrimary"
        :items="updatedContacts"
        item-title="name"
        item-value="id"
        variant="outlined"
        :bg-color="'white'"
        density="compact"
        width="9vw"
        class="mt-2"
        :rules="contactRules"
      ></v-select>
      <v-card-text class="sub-titles mr-5 pr-0" style="max-width: fit-content"
        >Secondary Contact:</v-card-text
      >
      <v-select
        v-model="newSecondary"
        :items="updatedContacts"
        item-title="name"
        item-value="id"
        variant="outlined"
        :bg-color="'white'"
        density="compact"
        width="9vw"
        :rules="contactRules"
        class="mr-3 mt-2"
        clearable
      ></v-select>
    </v-row>
    <v-row>
      <v-col cols="2">
        <v-card-text class="sub-titles">Contact Info:</v-card-text>
      </v-col>
      <v-col cols="4">
        <v-virtual-scroll
          :height="200"
          :items="updatedContacts"
          style="background-color: white"
          class="mt-4 rounded-lg"
          variant="outlined"
        >
          <template #default="{ item }">
            <v-btn
              :class="checkSelected(item) ? 'css1' : 'css2'"
              class="ma-2 justify-start"
              min-width="240px"
              :style="{
                backgroundColor: checkSelected(item) ? backgroundColor(state) : ''
              }"
              @click="selectContact(item)"
              >{{ item.name }}</v-btn
            >
          </template>
        </v-virtual-scroll>
        <v-row class="mt-2 mr-1 justify-end">
          <v-btn
            width="140px"
            height="35px"
            class="pa-0 ma-0 rounded-md"
            style="color: white"
            :style="{ backgroundColor: stateButtonColor(state) }"
            @click="createContact()"
          >
            <v-icon icon="mdi-plus" /> add contact
          </v-btn>
        </v-row>
      </v-col>
      <v-col>
        <v-card-title class="d-flex sub-titles justify-center mt-0 pt-0 mb-1"
          >Information:</v-card-title
        >
        <v-row cols="4">
          <v-col>
            <v-row v-for="field in fields" :key="field.name">
              <v-card-text class="pa-0 ma-0 mt-3 ml-2" style="max-width: 70px; font-style: italic">
                {{ field.name }}
              </v-card-text>
              <v-text-field
                ref="infoInputField"
                v-model="field.bind.value"
                :bg-color="'white'"
                variant="outlined"
                :rules="field.rules"
                :placeholder="getField(field.type)"
                density="compact"
              ></v-text-field>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="d-flex align-end mr-3" cols="2">
        <v-row class="d-flex flex-column justify-center align-center">
          <!-- Center both vertically and horizontally -->
          <v-btn
            class="mb-3"
            max-width="fit-content"
            style="transform: translateX(-7px)"
            @click="deleteSelected()"
            >Delete</v-btn
          >
          <v-btn
            class="mb-6"
            max-width="fit-content"
            style="color: white"
            :style="{ backgroundColor: stateButtonColor(state) }"
            @click="saveUpdatedInfo()"
            >Confirm</v-btn
          >
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
@import '@/renderer/styles/lowAdmin.css';
.css1 {
  background-color: rgba(114, 144, 113, 0.439);
}
.css2 {
  background-color: white;
}
.sub-titles {
  font-size: 120%;
  font-style: italic;
}
</style>
