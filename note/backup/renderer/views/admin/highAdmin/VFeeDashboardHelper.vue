<template>
  <!-- Deposit -->
  <!-- <FeeHome
    :update-history="modHistory"
    :rates="currentRatesByType"
    :updates="pendingRateUpdatesbyType"
    :lists="lists"
    :fee-type="'Deposit'"
  /> -->
  <!-- Handling Fee -->
  <FeeHome
    :update-history="modHistory"
    :rates="currentRatesByType"
    :updates="pendingRateUpdatesbyType"
    :lists="lists"
    :fee-type="'Handling'"
  />
</template>

<script setup lang="ts">
import FeeHome from '@/renderer/views/admin/highAdmin/VFeeDashboard.vue'

const sampleContacts = [
  {
    id: 1,
    name: 'Veronica Heather',
    phone: '111-222-3333',
    email: 'heather4@email.com',
    details: 'just a heather'
  },
  {
    id: 2,
    name: 'Andy Black',
    phone: '444-555-6666',
    email: 'shadowside@bvb.com',
    details: 'president'
  },
  {
    id: 3,
    name: 'Cody Carson',
    phone: '777-888-9999',
    email: 'setitoff@email.com',
    details: 'new product manager'
  },
  {
    id: 4,
    name: 'Eliot Waugh',
    phone: '123-456-7890',
    email: 'waugh@email.com',
    details: 'example role'
  },
  {
    id: 5,
    name: 'Quentin Coldwater',
    phone: '777-555-4242',
    email: 'magic@email.com',
    details: 'magician'
  }
]

const sampleNotes = [
  { time: new Date('10/1/24'), user: 'DM1', msg: 'clarified products1' },
  { time: new Date('10/2/24'), user: 'DM2', msg: 'clarified products2' },
  { time: new Date('10/3/24'), user: 'DM3', msg: 'clarified products3' },
  { time: new Date('10/4/24'), user: 'DM4', msg: 'clarified products4' },
  { time: new Date('10/5/24'), user: 'DM5', msg: 'clarified products5' },
  { time: new Date('10/6/24'), user: 'DM6', msg: 'clarified products6' },
  { time: new Date('10/7/24'), user: 'DM7', msg: 'clarified products7' },
  { time: new Date('10/8/24'), user: 'DM8', msg: 'clarified products8' },
  { time: new Date('10/9/24'), user: 'DM9', msg: 'clarified products9' }
]

const business1 = {
  name: 'Hannaford',
  status: false,
  states: ['Maine'],
  physAddress: '100 waterman dr, south portland, me 04101',
  invAddress: '679 main st, south portland, me 04106',
  notes: sampleNotes,
  contacts: sampleContacts,
  primaryContact: 4,
  secondaryContact: 2
}

const business2 = {
  name: 'Hannaford',
  status: false,
  states: ['Connecticut'],
  physAddress: '100 waterman dr, south portland, me 04101',
  invAddress: '679 main st, south portland, me 04106',
  notes: sampleNotes,
  contacts: sampleContacts,
  primaryContact: 4,
  secondaryContact: 2
}

const business3 = {
  name: 'Hannaford',
  status: false,
  states: ['New York', 'Maine'],
  physAddress: '100 waterman dr, south portland, me 04101',
  invAddress: '679 main st, south portland, me 04106',
  notes: sampleNotes,
  contacts: sampleContacts,
  primaryContact: 4,
  secondaryContact: 2
}

const lists = {
  states: ['Maine', 'New York', 'Connecticut'],
  types: ['Water', 'Spirit', 'Beverage'],
  materials: ['Aluminum', 'Plastic', 'Blue Glass', 'Clear Glass', 'Brown Glass'],
  distributors: ['Whole Foods', 'Costco', 'Hannaford', 'Shaws', 'Market Basket', 'Stop & Shop']
}

const currentRatesByType = [
  { state: 'Maine', category: 'Water', rate: '1' },
  { state: 'Maine', category: 'Spirit', rate: '2' },
  { state: 'Maine', category: 'Beverage', rate: '3' },

  { state: 'Connecticut', category: 'Water', rate: '4' },

  { state: 'Connecticut', category: 'Spirit', rate: '5' },

  { state: 'Connecticut', category: 'Beverage', rate: '6' },

  { state: 'New York', category: 'Water', rate: '7' },

  { state: 'New York', category: 'Spirit', rate: '8' },

  { state: 'New York', category: 'Beverage', rate: '9' }
]

const pendingRateUpdatesbyType = [
  {
    id: '1',
    state: 'Connecticut',
    category: 'Spirit',
    amount: '5',
    date: '10/1/2024',
    note: 'CT GOV',
    status: 'pending' // or "enacted" or "deleted"
  },
  {
    id: '2',
    state: 'Maine',
    category: 'Water',
    amount: '10',
    date: '2/1/2025',
    note: 'Maine GOV',
    status: 'pending'
  },
  {
    id: '3',
    state: 'New York',
    category: 'Beverage',
    amount: '15',
    date: '4/1/2025',
    note: 'NY GOV',
    status: 'deleted'
  },
  {
    id: '4',
    state: 'New York',
    category: 'Water',
    amount: '9',
    date: '2/1/2025',
    note: 'NY GOV',
    status: 'pending'
  },
  {
    id: '5',
    state: 'Connecticut',
    category: 'Beverage',
    amount: '9',
    date: '2/1/2022',
    note: 'CT GOV',
    status: 'pending'
  },
  {
    id: '6',
    state: 'Maine',
    category: 'Spirit',
    amount: '3',
    date: '1/1/2024',
    note: 'ME GOV',
    status: 'enacted'
  }
]

const currentRatesByMaterial = [
  { state: 'Maine', category: 'Aluminum', rate: '1' },
  { state: 'Maine', category: 'Plastic', rate: '2' },
  { state: 'Maine', category: 'Blue Glass', rate: '3' },
  { state: 'Maine', category: 'Clear Glass', rate: '4' },
  { state: 'Maine', category: 'Brown Glass', rate: '5' },
  { state: 'Connecticut', category: 'Aluminum', rate: '11' },
  { state: 'Connecticut', category: 'Plastic', rate: '21' },
  { state: 'Connecticut', category: 'Blue Glass', rate: '31' },
  { state: 'Connecticut', category: 'Clear Glass', rate: '41' },
  { state: 'Connecticut', category: 'Brown Glass', rate: '51' },
  { state: 'New York', category: 'Aluminum', rate: '12' },
  { state: 'New York', category: 'Plastic', rate: '22' },
  { state: 'New York', category: 'Blue Glass', rate: '32' },
  { state: 'New York', category: 'Clear Glass', rate: '42' },
  { state: 'New York', category: 'Brown Glass', rate: '52' }
]

const pendingRateUpdatesByMaterial = [
  {
    id: '1',
    state: 'Maine',
    category: 'Aluminum',
    amount: '1',
    date: '10/1/2024',
    note: 'ME GOV',
    status: 'pending'
  },
  {
    id: '2',
    state: 'Maine',
    category: 'Blue Glass',
    amount: '3',
    date: '10/2/2024',
    note: 'ME GOV',
    status: 'pending'
  },
  {
    id: '3',
    state: 'New York',
    category: 'Plastic',
    amount: '22',
    date: '10/3/2024',
    note: 'NY GOV',
    status: 'pending'
  },
  {
    id: '4',
    state: 'New York',
    category: 'Clear Glass',
    amount: '9',
    date: '10/3/2024',
    note: 'NY GOV',
    status: 'enacted'
  },
  {
    id: '5',
    state: 'Maine',
    category: 'Aluminum',
    amount: '22',
    date: '10/3/2024',
    note: 'ME GOV',
    status: 'deleted'
  },
  {
    id: '6',
    state: 'Connecticut',
    category: 'Aluminum',
    amount: '999',
    date: '10/3/2024',
    note: 'CT GOV',
    status: 'pending'
  }
]

const modHistory = [
  {
    author: 'DM',
    date: '9/28/2024',
    updateId: '1'
  },
  {
    author: 'DM',
    date: '9/28/2024',
    updateId: '2'
  },
  {
    author: 'DM',
    date: '9/28/2024',
    updateId: '3'
  },
  {
    author: 'DM',
    date: '9/28/2024',
    updateId: '4'
  },
  {
    author: 'DM',
    date: '9/28/2024',
    updateId: '5'
  },
  {
    author: 'DM',
    date: '9/28/2024',
    updateId: '6'
  }
]

const negotiatedRates = [
  { distributor: 'Costco', material: 'Aluminum', rate: '1', state: 'Maine' },
  { distributor: 'Costco', material: 'Plastic', rate: '2', state: 'Maine' },
  { distributor: 'Costco', material: 'Blue Glass', rate: '3', state: 'Maine' },
  { distributor: 'Costco', material: 'Clear Glass', rate: '4', state: 'Maine' },
  { distributor: 'Costco', material: 'Brown Glass', rate: '5', state: 'Maine' },
  {
    distributor: 'Hannaford',
    material: 'Aluminum',
    rate: '6',
    state: 'Connecticut'
  },
  {
    distributor: 'Hannaford',
    material: 'Plastic',
    rate: '7',
    state: 'Maine'
  },
  {
    distributor: 'Hannaford',
    material: 'Blue Glass',
    rate: '8',
    state: 'Connecticut'
  },
  {
    distributor: 'Hannaford',
    material: 'Clear Glass',
    rate: '9',
    state: 'Connecticut'
  },
  {
    distributor: 'Whole Foods',
    material: 'Plastic',
    rate: '3',
    state: 'Maine'
  },
  {
    distributor: 'Whole Foods',
    material: 'Blue Glass',
    rate: '4',
    state: 'Maine'
  },
  {
    distributor: 'Whole Foods',
    material: 'Clear Glass',
    rate: '5',
    state: 'Maine'
  },
  {
    distributor: 'Whole Foods',
    material: 'Brown Glass',
    rate: '6',
    state: 'Maine'
  },
  { distributor: 'Shaws', material: 'Aluminum', rate: '7', state: 'Maine' },
  { distributor: 'Shaws', material: 'Plastic', rate: '8', state: 'Maine' },
  { distributor: 'Shaws', material: 'Blue Glass', rate: '9', state: 'Maine' },
  { distributor: 'Shaws', material: 'Clear Glass', rate: '3', state: 'Maine' }
]

const pendingNegotiatedUpdates = [
  {
    id: '1',
    state: 'Connecticut',
    distributor: 'Costco',
    category: 'Aluminum',
    amount: '1',
    date: '10/1/2024',
    note: 'CT GOV',
    status: 'pending' // or "enacted" or "deleted"
  },
  {
    id: '2',
    state: 'Maine',
    distributor: 'Hannaford',
    category: 'Brown Glass',
    amount: '2',
    date: '2/1/2025',
    note: 'Maine GOV',
    status: 'pending'
  },
  {
    id: '3',
    state: 'New York',
    distributor: 'Hannaford',
    category: 'Plastic',
    amount: '3',
    date: '4/1/2025',
    note: 'NY GOV',
    status: 'deleted'
  },
  {
    id: '4',
    state: 'New York',
    distributor: 'Shaws',
    category: 'Aluminum',
    amount: '9',
    date: '2/1/2025',
    note: 'NY GOV',
    status: 'pending'
  },
  {
    id: '5',
    state: 'Connecticut',
    distributor: 'Stop & Shop',
    category: 'Aluminum',
    amount: '9',
    date: '2/1/2022',
    note: 'CT GOV',
    status: 'pending'
  },
  {
    id: '6',
    state: 'Maine',
    distributor: 'Hannaford',
    category: 'Clear Glass',
    amount: '3',
    date: '1/1/2024',
    note: 'ME GOV',
    status: 'enacted'
  }
]
</script>

<style lang="scss" scoped></style>
