<script setup lang="ts">
import { ref } from 'vue'
import { VBtn, VForm, VRadio, VRadioGroup, VTextarea } from 'vuetify/components'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
import { stateButtonColor } from '@/renderer/utils/stateColorGetter'
import ContactData from './ContactData.vue'

const snackbarStore = useSnackbarStore()

const props = defineProps<{
  disabled: boolean
  btnMsg: string
  state: string
  distributor?: boolean
}>()

const activeStatus = ref(true)
const invoice = ref('')
const physical = ref('')
const noteMsg = ref('')
const primarycontact = ref<typeof ContactData | null>(null)
const secondcontact = ref<typeof ContactData | null>(null)
const rightInfo = ref<VForm | null>(null)
const distNegRates = ref<boolean>(false)

const fieldRules = [(v: string) => !!v || 'Field cannot be blank.']

const emit = defineEmits(['trySave', 'cancel'])

const trySave = () => {
  // check if all values are present. needs validation check for contacts.
  const first = primarycontact.value?.runValidation()
  const second = secondcontact.value?.runValidation()
  rightInfo.value?.validate()
  const addresses = !!invoice.value && !!physical.value
  if (first && second && addresses) {
    emit('trySave', {
      primary: primarycontact.value?.getSimpleData(),
      secondary: secondcontact.value?.getSimpleData(),
      invoice: invoice.value,
      physical: physical.value,
      visible: activeStatus.value,
      useNegRates: props.distributor ? distNegRates.value : null,
      noteMsg: noteMsg.value,
    })
  } else {
    snackbarStore.showErrorMessage('Failed to Save');
  }
}

const cancel = () => { emit('cancel') }
</script>

<template>
  <v-container class="d-flex align-center justify-center" color="transparent">
    <v-row max-width="fit-content">
      <v-col class="d-flex justify-center pe-4" max-width="fit-content">
        <v-form>
          <v-card-title>Primary Contact</v-card-title>
          <ContactData ref="primarycontact" :locked="disabled" mandatory="true" />
          <v-card-title>Secondary Contact (Optional)</v-card-title>
          <ContactData ref="secondcontact" :locked="disabled" />
        </v-form>
      </v-col>
      <v-col class="d-flex justify-center" max-width="fit-content">
        <v-form ref="rightInfo" :disabled="disabled">
          <v-card-title>Status</v-card-title>
          <v-radio-group v-model="activeStatus" class="ma-0 pa-0" hide-details inline>
            <v-radio label="Active" :value="true"></v-radio>
            <v-radio label="Inactive" :value="false"></v-radio>
          </v-radio-group>
          <v-card-title>Physical Address</v-card-title>
          <v-text-field
            v-model="physical"
            :bg-color="disabled ? 'rgb(153, 153, 153)' : 'white'"
            class="text-box rounded-lg"
            clearable
            density="compact"
            placeholder="Enter Address"
            :rules="fieldRules"
            variant="outlined"
          ></v-text-field>
          &nbsp;
          <v-card-title>Invoice Address</v-card-title>
          <v-text-field
            v-model="invoice"
            :bg-color="disabled ? 'rgb(153, 153, 153)' : 'white'"
            class="text-box rounded-lg"
            clearable
            density="compact"
            placeholder="Enter Address"
            :rules="fieldRules"
            variant="outlined"
          ></v-text-field>
          <v-checkbox
            v-if="distributor"
            v-model="distNegRates"
            class="ma-0 pa-0 mb-2"
            style="max-height: 15px"
            label="Use Negotiated Pickup/Processing Rates"
          ></v-checkbox>
          &nbsp;
          <v-card-title>Note</v-card-title>
          <v-textarea
            v-model="noteMsg"
            :bg-color="disabled ? 'rgb(153, 153, 153)' : 'white'"
            class="notes"
            no-resize
            placeholder="Optional"
            variant="outlined"
          ></v-textarea>
          <v-row class="justify-center" style="z-index: 10000; position: relative">
            <v-btn class="final-btns w-25" @click="cancel()">{{ btnMsg }}</v-btn>
            <v-btn
              class="final-btns w-25 ml-8"
              :class="disabled ? 'inactive-btn' : 'active-btn'"
              :disabled="disabled"
              :style="{ backgroundColor: stateButtonColor(state) }"
              style="color: white"
              @click="trySave()"
              >Add</v-btn
            >
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.final-btns {
  margin-left: 1%;
  margin-right: 1%;
}
.notes {
  height: 34%;
}
.inactive-btn {
  background-color: rgb(153, 153, 153);
}
.active-btn {
  background-color: green;
}
</style>
