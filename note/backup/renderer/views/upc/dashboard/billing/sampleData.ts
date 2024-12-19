const lists = {
  states: ['Maine', 'New York', 'Connecticut'],
  initiators: [
    'Dino Drinks',
    'Aloes',
    'The Cat Company',
    'Altercation',
    'Barn Bros Beverages',
    'Pineconez'
  ],
  distributors: [
    'Nov-el',
    'Otto',
    'Duckfat',
    'Standard Baking Co.',
    'Gelato Fiasco',
    'Two Fat Cats'
  ],
  pickupAgents: [
    'Gipsy Danger',
    'Striker Eureka',
    'Cherno Alpha',
    'Crimson Typhoon',
    'Coyote Tango',
    'Lucky Seven',
    'Brawler Yukon'
  ],
  regions: ['Ogrimmar', 'Silvermoon', "Kel'Thuzad", 'Kalimdor', 'Azeroth', 'Sholazar'],
  manufacturers: [
    'Black Veil Brides',
    'Glass Animals',
    'IDKHOW',
    'My Chemical Romance',
    'Starset',
    'Fall Out Boy',
    'Muse',
    'Sleeping with Sirens'
  ],
  types: ['Water', 'Spirit', 'Bev'],
  materials: ['Aluminum', 'Plastic', 'Blue Glass', 'Clear Glass', 'Brown Glass'],
  regionsByState: [
    { state: 'Maine', regions: ['Silvermoon', 'Ogrimmar', 'Undercity'] },
    { state: 'Connecticut', regions: ["Kel'Thuzad", 'Sholazar'] },
    { state: 'New York', regions: ['Azeroth', 'Kalimdor'] }
  ]
}

const partyPoison = {
  code: 4444444124444,
  name: 'Party Poison',
  type: 'Spirit',
  manufacturer: 'My Chemical Romance',
  size: 4,
  material: 'Clear Glass'
}
const milkTea = {
  code: 666666666612,
  name: 'Stay Frosty Royal Milk Tea',
  type: 'Bev',
  manufacturer: 'Fall Out Boy',
  size: 6,
  material: 'Aluminum'
}

const upcs = [
  {
    code: 1111111111111,
    name: 'Absinthe',
    type: 'Spirit',
    manufacturer: 'IDKHOW',
    size: 1,
    material: 'Aluminum'
  },
  {
    code: 2222222222222,
    name: 'Pork Soda',
    type: 'Bev',
    manufacturer: 'Glass Animals',
    size: 2,
    material: 'Plastic'
  },
  {
    code: 3333333333333,
    name: 'Dreamcatcher',
    type: 'Water',
    manufacturer: 'Starset',
    size: 3,
    material: 'Aluminum'
  },
  partyPoison,
  {
    code: 555145555555,
    name: 'Sweet Blasphemy',
    type: 'Water',
    manufacturer: 'Black Veil Brides',
    size: 5,
    material: 'Green Glass'
  },
  milkTea,
  {
    code: 777777777712,
    name: 'Big Freeze',
    type: 'Bev',
    manufacturer: 'Muse',
    size: 7,
    material: 'Clear Glass'
  },
  {
    code: 8888888888888,
    name: 'Venom',
    type: 'Spirit',
    manufacturer: 'My Chemical Romance',
    size: 7,
    material: 'Brown Glass'
  },
  {
    code: 9999999999999,
    name: 'Cheers',
    type: 'Water',
    manufacturer: 'Sleeping with Sirens',
    size: 7,
    material: 'Clear Glass'
  },
  {
    code: 1010101010101,
    name: 'Starlight',
    type: 'Water',
    manufacturer: 'Starset',
    size: 7,
    material: 'Green Glass'
  }
]

const rule1 = {
  id: 1,
  upc: 4444444124444,
  state: 'New York',
  region: 'Azeroth',
  initiator: 'Aloes',
  distributor: 'Otto',
  pickupAgent: 'Striker Eureka',
  startDate: new Date('1/1/2024'),
  endDate: new Date('10/1/2026'),
  dateAdded: new Date('10/1/2024'),
  author: 'Peanut'
}
const rule2 = {
  id: 2,
  upc: 4444444124444,
  state: 'New York',
  region: 'Kalimdor',
  initiator: 'Aloes',
  distributor: 'Otto',
  pickupAgent: 'Striker Eureka',
  startDate: new Date('1/1/2024'),
  endDate: new Date('10/1/2025'),
  dateAdded: new Date('10/1/2024'),
  author: 'Peanut'
}

const billingRules = [
  {
    id: 1,
    upc: 4444444124444,
    state: 'New York',
    region: 'Azeroth',
    initiator: 'Aloes',
    distributor: 'Otto',
    pickupAgent: 'Striker Eureka',
    startDate: new Date('1/1/2024'),
    endDate: new Date('10/1/2026'),
    dateAdded: new Date('10/1/2024'),
    author: 'Peanut'
  },
  {
    id: 2,
    upc: 4444444124444,
    state: 'New York',
    region: 'Kalimdor',
    initiator: 'Aloes',
    distributor: 'Otto',
    pickupAgent: 'Striker Eureka',
    startDate: new Date('1/1/2024'),
    endDate: new Date('10/1/2025'),
    dateAdded: new Date('10/1/2024'),
    author: 'Peanut'
  },
  {
    id: 3,
    upc: 4444444124444,
    state: 'Maine',
    region: 'Silvermoon',
    initiator: 'Altercation',
    distributor: 'Duckfat',
    pickupAgent: 'Gipsy Danger',
    startDate: new Date('1/1/2024'),
    dateAdded: new Date('10/1/2024'),
    author: 'Peanut'
  },
  {
    id: 4,
    upc: 4444444124444,
    state: 'Maine',
    region: 'Ogrimmar',
    initiator: 'Altercation',
    distributor: 'Duckfat',
    pickupAgent: 'Gipsy Danger',
    startDate: new Date('1/1/2024'),
    dateAdded: new Date('10/1/2024'),
    author: 'Peanut'
  },
  {
    id: 5,
    upc: 4444444124444,
    state: 'Maine',
    region: 'Undercity',
    initiator: 'Altercation',
    distributor: 'Duckfat',
    pickupAgent: 'Gipsy Danger',
    startDate: new Date('1/1/2024'),
    endDate: new Date('10/1/2026'),
    dateAdded: new Date('10/1/2024'),
    author: 'Peanut'
  },
  {
    id: 6,
    upc: 4444444124444,
    state: 'Connecticut',
    region: "Kel'Thuzad",
    initiator: 'Dino Drinks',
    distributor: 'The Standard Baking Co.',
    pickupAgent: 'Cherno Alpha',
    startDate: new Date('1/1/2024'),
    endDate: new Date('10/1/2026'),
    dateAdded: new Date('10/1/2024'),
    author: 'Peanut'
  },
  {
    id: 7,
    upc: 4444444124444,
    state: 'Connecticut',
    region: 'Sholazar',
    initiator: 'Dino Drinks',
    distributor: 'The Standard Baking Co.',
    pickupAgent: 'Cherno Alpha',
    startDate: new Date('1/1/2024'),
    endDate: new Date('10/1/2026'),
    dateAdded: new Date('10/1/2024'),
    author: 'Peanut'
  },
  {
    id: 11,
    upc: 666666666612,
    state: 'New York',
    region: 'Azeroth',
    initiator: 'Aloes',
    distributor: 'Otto',
    pickupAgent: 'Striker Eureka',
    startDate: new Date('1/1/2024'),
    dateAdded: new Date('10/1/2024'),
    author: 'Peanut'
  },
  {
    id: 12,
    upc: 666666666612,
    state: 'New York',
    region: 'Kalimdor',
    initiator: 'Aloes',
    distributor: 'Otto',
    pickupAgent: 'Striker Eureka',
    startDate: new Date('1/1/2024'),
    dateAdded: new Date('10/1/2024'),
    author: 'Peanut'
  },
  {
    id: 13,
    upc: 666666666612,
    state: 'Maine',
    region: 'Silvermoon',
    initiator: 'Altercation',
    distributor: 'Duckfat',
    pickupAgent: 'Gipsy Danger',
    startDate: new Date('1/1/2024'),
    dateAdded: new Date('10/1/2024'),
    author: 'Peanut'
  },
  {
    id: 14,
    upc: 666666666612,
    state: 'Maine',
    region: 'Ogrimmar',
    initiator: 'Altercation',
    distributor: 'Duckfat',
    pickupAgent: 'Gipsy Danger',
    startDate: new Date('1/1/2024'),
    endDate: new Date('10/1/2026'),
    dateAdded: new Date('10/1/2024'),
    author: 'Peanut'
  },
  {
    id: 15,
    upc: 666666666612,
    state: 'Maine',
    region: 'Undercity',
    initiator: 'Altercation',
    distributor: 'Duckfat',
    pickupAgent: 'Gipsy Danger',
    startDate: new Date('1/1/2024'),
    dateAdded: new Date('10/1/2024'),
    author: 'Peanut'
  },
  {
    id: 16,
    upc: 666666666612,
    state: 'Connecticut',
    region: "Kel'Thuzad",
    initiator: 'Altercation',
    distributor: 'The Standard Baking Co.',
    pickupAgent: 'Lucky Seven',
    startDate: new Date('1/1/2024'),
    dateAdded: new Date('10/1/2024'),
    author: 'Peanut'
  },
  {
    id: 17,
    upc: 666666666612,
    state: 'Connecticut',
    region: 'Sholazar',
    initiator: 'Altercation',
    distributor: 'The Standard Baking Co.',
    pickupAgent: 'Lucky Seven',
    startDate: new Date('1/1/2024'),
    dateAdded: new Date('10/1/2024'),
    author: 'Peanut'
  },
  {
    id: 21,
    upc: 1010101010101,
    state: 'New York',
    region: 'Azeroth',
    initiator: 'Aloes',
    distributor: 'Otto',
    pickupAgent: 'Striker Eureka',
    startDate: new Date('1/1/2024'),
    endDate: new Date('10/1/2026'),
    dateAdded: new Date('10/1/2024'),
    author: 'Peanut'
  },
  {
    id: 22,
    upc: 1010101010101,
    state: 'New York',
    region: 'Kalimdor',
    initiator: 'Aloes',
    distributor: 'Otto',
    pickupAgent: 'Striker Eureka',
    startDate: new Date('1/1/2024'),
    endDate: new Date('10/1/2026'),
    dateAdded: new Date('10/1/2024'),
    author: 'Peanut'
  },
  {
    id: 23,
    upc: 1010101010101,
    state: 'Maine',
    region: 'Silvermoon',
    initiator: 'Altercation',
    distributor: 'Duckfat',
    pickupAgent: 'Gipsy Danger',
    startDate: new Date('1/1/2024'),
    dateAdded: new Date('10/1/2024'),
    author: 'Peanut'
  },
  {
    id: 24,
    upc: 1010101010101,
    state: 'Maine',
    region: 'Ogrimmar',
    initiator: 'Altercation',
    distributor: 'Duckfat',
    pickupAgent: 'Gipsy Danger',
    startDate: new Date('1/1/2024'),
    endDate: new Date('10/1/2026'),
    dateAdded: new Date('10/1/2024'),
    author: 'Peanut'
  },
  {
    id: 25,
    upc: 1010101010101,
    state: 'Maine',
    region: 'Undercity',
    initiator: 'Altercation',
    distributor: 'Duckfat',
    pickupAgent: 'Gipsy Danger',
    startDate: new Date('1/1/2024'),
    endDate: new Date('10/1/2026'),
    dateAdded: new Date('10/1/2024'),
    author: 'Peanut'
  },
  {
    id: 26,
    upc: 1010101010101,
    state: 'Connecticut',
    region: "Kel'Thuzad",
    initiator: 'Dino Drinks',
    distributor: 'The Standard Baking Co.',
    pickupAgent: 'Cherno Alpha',
    startDate: new Date('1/1/2024'),
    endDate: new Date('10/1/2026'),
    dateAdded: new Date('10/1/2024'),
    author: 'Peanut'
  },
  {
    id: 27,
    upc: 1010101010101,
    state: 'Connecticut',
    region: 'Sholazar',
    initiator: 'Dino Drinks',
    distributor: 'The Standard Baking Co.',
    pickupAgent: 'Lucky Seven',
    startDate: new Date('1/1/2024'),
    endDate: new Date('10/1/2026'),
    dateAdded: new Date('10/1/2024'),
    author: 'Peanut'
  }
]

export { lists, partyPoison, milkTea, upcs, rule1, rule2, billingRules }
