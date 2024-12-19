// TODO: update the contact field for all companies
// TODO: is the UPC info complete if missing 'lastScanDate' and 'totalScanUnit' fields?

//  #region Sample Data
// fake user data
function createUserList() {
  return [
    {
      userId: 1,
      username: 'cat@clynk.com',
      password: 'catmeow',
      roles: ['high-admin'],
      buttons: ['cuser.detail'],
      routes: ['statefee'],
      token: 'High Admin Token'
    },
    {
      userId: 2,
      username: 'dog@clynk.com',
      password: 'dogbark',
      roles: ['admin'],
      buttons: ['cuser.detail', 'cuser.user'],
      routes: ['statefee'],
      token: 'Admin Token'
    },
    {
      userId: 3,
      username: 'owl@clynk.com',
      password: 'owlscream',
      roles: ['user'],
      buttons: ['cuser.detail', 'cuser.user'],
      routes: [''],
      token: 'User'
    }
  ]
}

// fake upc data
function createUPCList() {
  return [
    {
      upcId: 1,
      upcCode: '193902780009',
      name: 'BUBBLE TEA',
      beverageType: 'Beverage',
      manufacturer: 'Hannaford',
      manufacturerId: 1,
      volumeSize: 24,
      weight: 10,
      material: 'Glass - Brown',
      completeUPCInfo: true,
      firstScanDate: '2000-02-20',
      lastScanDate: '2020-02-20',
      totalScanUnit: 9999,
      notes: [
        { message: 'upc#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'upc#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'upc#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'upc#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ]
    },
    {
      upcId: 2,
      upcCode: '193902780008',
      name: 'OOLANG WATER',
      beverageType: 'Water',
      manufacturer: 'Black Veil Brides',
      manufacturerId: 2,
      volumeSize: 12,
      weight: 10,
      material: 'Plastic',
      completeUPCInfo: true,
      firstScanDate: '2000-02-20',
      lastScanDate: '2020-02-20',
      totalScanUnit: 9998,
      notes: [
        { message: 'upc#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'upc#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'upc#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'upc#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ]
    },
    {
      upcId: 3,
      upcCode: '193902780007',
      name: 'HONEY ROSE BLUEBERRY WINE',
      beverageType: 'Spirit',
      manufacturer: 'Glass Animals',
      manufacturerId: 3,
      volumeSize: 20,
      weight: 10,
      material: 'Metal',
      completeUPCInfo: true,
      firstScanDate: '2000-02-20',
      lastScanDate: '2020-02-20',
      totalScanUnit: 77,
      notes: [
        { message: 'upc#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'upc#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'upc#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'upc#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ]
    },
    {
      upcId: 4,
      upcCode: '193902780006',
      name: 'POLY JUICE',
      beverageType: 'Beverage',
      // manufacturer: 'Set it Off',
      volumeSize: 60,
      weight: 10,
      material: 'Metal',
      completeUPCInfo: false,
      lastScanDate: '2020-02-20',
      totalScanUnit: 666,
      notes: [
        { message: 'upc#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'upc#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'upc#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'upc#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ]
    },
    {
      upcId: 5,
      upcCode: '193902780005',
      name: 'SLIME WATER',
      beverageType: 'Water',
      manufacturer: 'My Chemical Romance',
      manufacturerId: 5,
      volumeSize: 35,
      weight: 10,
      material: 'Plastic',
      completeUPCInfo: true,
      firstScanDate: '2000-02-20',
      lastScanDate: '2020-02-20',
      totalScanUnit: 5,
      notes: [
        { message: 'upc#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'upc#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'upc#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'upc#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ]
    },
    {
      upcId: 6,
      upcCode: '193902780004',
      name: 'STARFRUIT WINE',
      beverageType: 'Spirit',
      manufacturer: 'Starset',
      manufacturerId: 6,
      volumeSize: 50,
      weight: 10,
      material: 'Plastic',
      completeUPCInfo: true,
      firstScanDate: '2000-02-20',
      lastScanDate: '2020-02-20',
      totalScanUnit: 4444,
      notes: [
        { message: 'upc#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'upc#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'upc#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'upc#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ]
    },
    {
      upcId: 7,
      upcCode: '193902780003',
      // name: 'OATMEAL PFAS TEA',
      beverageType: 'Beverage',
      manufacturer: 'Fall Out Boy',
      manufacturerId: 7,
      volumeSize: 75,
      material: 'Glass - Clear',
      completeUPCInfo: false,
      totalScanUnit: 3
    },
    {
      upcId: 8,
      upcCode: '193902780002',
      name: 'AVOCADO WATER',
      beverageType: 'Water',
      manufacturer: 'The Beatles',
      manufacturerId: 8,
      volumeSize: 18,
      material: 'Metal',
      completeUPCInfo: false,
      totalScanUnit: 22
    },
    {
      upcId: 9,
      upcCode: '193902780001',
      name: 'OCEAN LIQUID',
      beverageType: 'Spirit',
      manufacturer: 'Nirvana',
      manufacturerId: 9,
      volumeSize: 12,
      material: 'Glass - Green',
      completeUPCInfo: false,
      totalScanUnit: 111
    },
    {
      upcId: 10,
      upcCode: '193902780000',
      name: 'LOBSTER MILK',
      beverageType: 'Beverage',
      manufacturer: "Guns N' Roses",
      manufacturerId: 10,
      volumeSize: 12,
      material: 'Metal',
      completeUPCInfo: false,
      lastScanDate: '2024-02-24',
      totalScanUnit: 10,
      notes: [{ message: 'upc#1 update#1', username: 'owl@clynk.com', date: '09/04/2024' }]
    },
    {
      upcId: 11,
      upcCode: '193902780010',
      name: 'MYSTERY GREEN JUICE',
      beverageType: 'Spirit',
      manufacturer: 'Nirvana',
      manufacturerId: 9,
      volumeSize: 666,
      material: 'Plastic',
      completeUPCInfo: false,
      totalScanUnit: 9999
    },
    {
      upcId: 12,
      upcCode: '193902780011',
      name: 'LUKEWARM WATER',
      beverageType: 'Spirit',
      manufacturer: 'The Beatles',
      manufacturerId: 8,
      volumeSize: 35,
      weight: 10,
      material: 'Metal',
      completeUPCInfo: true,
      firstScanDate: '2020-02-20',
      lastScanDate: '2024-02-24',
      totalScanUnit: 8,
      notes: [
        { message: 'upc#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'upc#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'upc#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'upc#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ]
    }
  ]
}

// fake company data (for manufacturer, distributor, initiator, and pickup agents)
function createInitiatorList() {
  return [
    {
      id: 1,
      name: 'Hannaford',
      visible: true,
      states: ['Maine', 'Connecticut', 'New York'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 2,
      name: 'Black Veil Brides',
      visible: true,
      states: ['New York'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 3,
      name: 'Glass Animals',
      visible: true,
      states: ['Connecticut'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 4,
      name: 'Set it Off',
      visible: false,
      states: ['Connecticut'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 5,
      name: 'My Chemical Romance',
      visible: true,
      states: ['New York'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 6,
      name: 'Starset',
      visible: true,
      states: ['Maine'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 7,
      name: 'Fall Out Boy',
      visible: false,
      states: ['Maine'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 8,
      name: 'The Beatles',
      visible: true,
      states: ['Connecticut'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 9,
      name: 'Nirvana',
      visible: true,
      states: ['New York'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 10,
      name: "Guns N' Roses",
      visible: false,
      states: ['New York'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    }
  ]
}

function createManufacturerList() {
  return [
    {
      id: 1,
      name: 'Hannaford',
      visible: true,
      states: ['Maine', 'Connecticut', 'New York'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 2,
      name: 'Black Veil Brides',
      visible: true,
      states: ['New York'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 3,
      name: 'Glass Animals',
      visible: true,
      states: ['Connecticut'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 4,
      name: 'Set it Off',
      visible: false,
      states: ['Connecticut'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 5,
      name: 'My Chemical Romance',
      visible: true,
      states: ['New York'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 6,
      name: 'Starset',
      visible: true,
      states: ['Maine'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 7,
      name: 'Fall Out Boy',
      visible: false,
      states: ['Maine'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 8,
      name: 'The Beatles',
      visible: true,
      states: ['Connecticut'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 9,
      name: 'Nirvana',
      visible: true,
      states: ['New York'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 10,
      name: "Guns N' Roses",
      visible: false,
      states: ['New York'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    }
  ]
}

function createPickupList() {
  return [
    {
      id: 1,
      name: 'Hannaford',
      visible: true,
      states: ['Maine', 'Connecticut', 'New York'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 2,
      name: 'Black Veil Brides',
      visible: true,
      states: ['New York'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 3,
      name: 'Glass Animals',
      visible: true,
      states: ['Connecticut'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 4,
      name: 'Set it Off',
      visible: false,
      states: ['Connecticut'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 5,
      name: 'My Chemical Romance',
      visible: true,
      states: ['New York'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 6,
      name: 'Starset',
      visible: true,
      states: ['Maine'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 7,
      name: 'Fall Out Boy',
      visible: false,
      states: ['Maine'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 8,
      name: 'The Beatles',
      visible: true,
      states: ['Connecticut'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 9,
      name: 'Nirvana',
      visible: true,
      states: ['New York'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 10,
      name: "Guns N' Roses",
      visible: false,
      states: ['New York'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    }
  ]
}

function createDistributorList() {
  return [
    {
      id: 1,
      name: 'Hannaford',
      visible: true,
      states: ['Maine', 'Connecticut', 'New York'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 2,
      name: 'Black Veil Brides',
      visible: true,
      states: ['New York'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 3,
      name: 'Glass Animals',
      visible: true,
      states: ['Connecticut'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 4,
      name: 'Set it Off',
      visible: false,
      states: ['Connecticut'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 5,
      name: 'My Chemical Romance',
      visible: true,
      states: ['New York'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 6,
      name: 'Starset',
      visible: true,
      states: ['Maine'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 7,
      name: 'Fall Out Boy',
      visible: false,
      states: ['Maine'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 8,
      name: 'The Beatles',
      visible: true,
      states: ['Connecticut'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 9,
      name: 'Nirvana',
      visible: true,
      states: ['New York'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    },
    {
      id: 10,
      name: "Guns N' Roses",
      visible: false,
      states: ['New York'],
      addedByUserId: 3,
      physAddress: '100 waterman dr, south portland, me 04101',
      invAddress: '679 main st, south portland, me 04106',
      notes: [
        { message: 'company#1 update#1', username: 'owl@clynk.com', date: '09/01/2024' },
        { message: 'company#1 update#2', username: 'dog@clynk.com', date: '09/02/2024' },
        { message: 'company#1 update#3', username: 'owl@clynk.com', date: '09/03/2024' },
        { message: 'company#1 update#4', username: 'owl@clynk.com', date: '09/04/2024' }
      ],
      primaryContactId: 1,
      secondaryContactId: [2, 3, 4],
      primaryContact: {
        id: 1,
        name: 'Paul',
        phone: '123-571-1131',
        email: 'PP@compny.com',
        details: 'Its hip to be square'
      },
      secondaryContact: [
        {
          id: 2,
          name: 'Christ',
          phone: '123-571-1131',
          email: '@compny.com',
          details: 'Its hip to be square'
        },
        { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
        {
          id: 4,
          name: 'Elizabeth',
          phone: '123-571-1131',
          email: 'EE@compny.com',
          details: 'EE here'
        }
      ],
      lastUpdatedDate: '09/04/2024',
      needsNegRates: false
    }
  ]
}

// fake contact data
function createContactList() {
  return [
    {
      id: 1,
      name: 'Paul',
      phone: '123-571-1131',
      email: 'PP@compny.com',
      details: 'Its hip to be square'
    },
    {
      id: 2,
      name: 'Christ',
      phone: '123-571-1131',
      email: '@compny.com',
      details: 'Its hip to be square'
    },
    { id: 3, name: 'Jane', phone: '123-571-1131', email: 'JD@compny.com', details: 'JD here' },
    {
      id: 4,
      name: 'Elizabeth',
      phone: '123-571-1131',
      email: 'EE@compny.com',
      details: 'EE here'
    }
  ]
}

// fake pickup processing fee
// TODO: modify later based on real scenario
function createPickupFeeStateList() {
  return [
    { state: 'Maine', glass: 3, plastic: 5, metal: 5 },
    { state: 'New York', glass: 4, plastic: 6, metal: 6 },
    { state: 'Connecticut', glass: 3.5, plastic: 5.5, metal: 5.5 }
  ]
}

function createPickupFeeCompanyList() {
  return [
    { companyId: 1, glass: 5, plastic: 7, metal: 8 },
    { companyId: 2, glass: 5, plastic: 7, metal: 8 },
    { companyId: 3, glass: 5, plastic: 7, metal: 8 }
  ]
}

// fake billing rules
function createBillingList() {
  return [
    {
      id: 1,
      upcCode: '193902780006',
      state: 'New York',
      region: 'Azeroth',
      initiator: 'Aloes',
      distributor: 'Set It Off',
      pickupAgent: 'Striker Eureka',
      startDate: new Date('12/1/2024'),
      endDate: new Date('12/2/2024'),
      dateAdded: new Date('10/1/2024'),
      author: 'Peanut',

      initiatorId: 8,
      distributorId: 7,
      pickupAgentId: 1
    },
    {
      id: 2,
      upcCode: '193902780006',
      state: 'New York',
      region: 'Kalimdor',
      initiator: 'Aloes',
      distributor: 'Set It Off',
      pickupAgent: 'Striker Eureka',
      startDate: new Date('12/1/2024'),
      endDate: new Date('12/5/2024'),
      dateAdded: new Date('10/1/2024'),
      author: 'Peanut'
    },
    {
      id: 3,
      upcCode: '193902780006',
      state: 'Maine',
      region: 'Silvermoon',
      initiator: 'Altercation',
      distributor: 'My Chemical Romance',
      pickupAgent: 'Gipsy Danger',
      startDate: new Date('12/1/2024'),
      dateAdded: new Date('10/1/2024'),
      author: 'Peanut'
    },
    {
      id: 4,
      upcCode: '193902780006',
      state: 'Maine',
      region: 'Ogrimmar',
      initiator: 'Altercation',
      distributor: 'My Chemical Romance',
      pickupAgent: 'Gipsy Danger',
      startDate: new Date('12/1/2024'),
      dateAdded: new Date('10/1/2024'),
      author: 'Peanut'
    },
    {
      id: 5,
      upcCode: '193902780006',
      state: 'Maine',
      region: 'Undercity',
      initiator: 'Altercation',
      distributor: 'My Chemical Romance',
      pickupAgent: 'Gipsy Danger',
      startDate: new Date('12/1/2024'),
      endDate: new Date('12/5/2024'),
      dateAdded: new Date('10/1/2024'),
      author: 'Peanut'
    },
    {
      id: 6,
      upcCode: '193902780006',
      state: 'Connecticut',
      region: "Kel'Thuzad",
      initiator: 'Dino Drinks',
      distributor: 'Black Veil Brides',
      pickupAgent: 'Cherno Alpha',
      startDate: new Date('12/1/2024'),
      endDate: new Date('12/25/2024'),
      dateAdded: new Date('10/1/2024'),
      author: 'Peanut'
    },
    {
      id: 7,
      upcCode: '193902780006',
      state: 'Connecticut',
      region: 'Sholazar',
      initiator: 'Dino Drinks',
      distributor: 'Black Veil Brides',
      pickupAgent: 'Cherno Alpha',
      startDate: new Date('12/10/2024'),
      endDate: new Date('12/11/2024'),
      dateAdded: new Date('10/1/2024'),
      author: 'Peanut'
    },
    {
      id: 11,
      upcCode: '193902780005',
      state: 'New York',
      region: 'Azeroth',
      initiator: 'Aloes',
      distributor: 'Set It Off',
      pickupAgent: 'Striker Eureka',
      startDate: new Date('1/1/2024'),
      dateAdded: new Date('10/1/2024'),
      author: 'Peanut'
    },
    {
      id: 12,
      upcCode: '193902780005',
      state: 'New York',
      region: 'Kalimdor',
      initiator: 'Aloes',
      distributor: 'Set It Off',
      pickupAgent: 'Striker Eureka',
      startDate: new Date('1/1/2024'),
      dateAdded: new Date('10/1/2024'),
      author: 'Peanut'
    },
    {
      id: 13,
      upcCode: '193902780005',
      state: 'Maine',
      region: 'Silvermoon',
      initiator: 'Altercation',
      distributor: 'My Chemical Romance',
      pickupAgent: 'Gipsy Danger',
      startDate: new Date('1/1/2024'),
      dateAdded: new Date('10/1/2024'),
      author: 'Peanut'
    },
    {
      id: 14,
      upcCode: '193902780005',
      state: 'Maine',
      region: 'Ogrimmar',
      initiator: 'Altercation',
      distributor: 'My Chemical Romance',
      pickupAgent: 'Gipsy Danger',
      startDate: new Date('1/1/2024'),
      endDate: new Date('10/1/2026'),
      dateAdded: new Date('10/1/2024'),
      author: 'Peanut'
    },
    {
      id: 15,
      upcCode: '193902780005',
      state: 'Maine',
      region: 'Undercity',
      initiator: 'Altercation',
      distributor: 'My Chemical Romance',
      pickupAgent: 'Gipsy Danger',
      startDate: new Date('1/1/2024'),
      dateAdded: new Date('10/1/2024'),
      author: 'Peanut'
    },
    {
      id: 16,
      upcCode: '193902780005',
      state: 'Connecticut',
      region: "Kel'Thuzad",
      initiator: 'Altercation',
      distributor: 'Black Veil Brides',
      pickupAgent: 'Lucky Seven',
      startDate: new Date('1/1/2024'),
      dateAdded: new Date('10/1/2024'),
      author: 'Peanut'
    },
    {
      id: 17,
      upcCode: '193902780005',
      state: 'Connecticut',
      region: 'Sholazar',
      initiator: 'Altercation',
      distributor: 'Black Veil Brides',
      pickupAgent: 'Lucky Seven',
      startDate: new Date('1/1/2024'),
      dateAdded: new Date('10/1/2024'),
      author: 'Peanut'
    },
    {
      id: 21,
      upcCode: '193902780002',
      state: 'New York',
      region: 'Azeroth',
      initiator: 'Aloes',
      distributor: 'Set It Off',
      pickupAgent: 'Striker Eureka',
      startDate: new Date('1/1/2024'),
      endDate: new Date('10/1/2026'),
      dateAdded: new Date('10/1/2024'),
      author: 'Peanut'
    },
    {
      id: 22,
      upcCode: '193902780002',
      state: 'New York',
      region: 'Kalimdor',
      initiator: 'Aloes',
      distributor: 'Set It Off',
      pickupAgent: 'Striker Eureka',
      startDate: new Date('1/1/2024'),
      endDate: new Date('10/1/2026'),
      dateAdded: new Date('10/1/2024'),
      author: 'Peanut'
    },
    {
      id: 23,
      upcCode: '193902780002',
      state: 'Maine',
      region: 'Silvermoon',
      initiator: 'Altercation',
      distributor: 'My Chemical Romance',
      pickupAgent: 'Gipsy Danger',
      startDate: new Date('1/1/2024'),
      dateAdded: new Date('10/1/2024'),
      author: 'Peanut'
    },
    {
      id: 24,
      upcCode: '193902780002',
      state: 'Maine',
      region: 'Ogrimmar',
      initiator: 'Altercation',
      distributor: 'My Chemical Romance',
      pickupAgent: 'Gipsy Danger',
      startDate: new Date('1/1/2024'),
      endDate: new Date('10/1/2026'),
      dateAdded: new Date('10/1/2024'),
      author: 'Peanut'
    },
    {
      id: 25,
      upcCode: '193902780002',
      state: 'Maine',
      region: 'Undercity',
      initiator: 'Altercation',
      distributor: 'My Chemical Romance',
      pickupAgent: 'Gipsy Danger',
      startDate: new Date('1/1/2024'),
      endDate: new Date('10/1/2026'),
      dateAdded: new Date('10/1/2024'),
      author: 'Peanut'
    },
    {
      id: 26,
      upcCode: '193902780002',
      state: 'Connecticut',
      region: "Kel'Thuzad",
      initiator: 'Dino Drinks',
      distributor: 'Black Veil Brides',
      pickupAgent: 'Cherno Alpha',
      startDate: new Date('1/1/2024'),
      endDate: new Date('10/1/2024'),
      dateAdded: new Date('10/1/2024'),
      author: 'Peanut'
    },
    {
      id: 27,
      upcCode: '193902780002',
      state: 'Connecticut',
      region: 'Sholazar',
      initiator: 'Dino Drinks',
      distributor: 'Black Veil Brides',
      pickupAgent: 'Lucky Seven',
      startDate: new Date('1/1/2024'),
      endDate: new Date('10/1/2026'),
      dateAdded: new Date('10/1/2024'),
      author: 'Peanut'
    }
  ]
}

// fake to do list data
function createToDoData() {
  return [
    {
      upcCode: '193902780009',
      state: 'New York',
      userID: 1,
      status: true,
      todoid: 1
    },
    {
      upcCode: '193902780009',
      state: 'Maine',
      userID: 1,
      status: false,
      todoid: 2
    },
    {
      upcCode: '193902780008',
      state: 'Maine',
      userID: 1,
      status: true,
      todoid: 3
    },
    {
      upcCode: '193902780007',
      state: 'New York',
      userID: 1,
      status: true,
      todoid: 4
    },
    {
      upcCode: '193902780006',
      state: 'Connecticut',
      userID: 2,
      status: true,
      todoid: 5
    },
    {
      upcCode: '193902780005',
      state: 'New York',
      userID: 2,
      status: true,
      todoid: 6
    },
    {
      upcCode: '193902780004',
      state: '',
      userID: 1,
      status: true,
      todoid: 7
    }
  ]
}

// states
function createStatesAndRegions() {
  return [
    { id: 1, state: 'Maine', regions: ['Silvermoon', 'Ogrimmar', 'Undercity'] },
    { id: 2, state: 'Connecticut', regions: ["Kel'Thuzad", 'Sholazar'] },
    { id: 3, state: 'New York', regions: ['Azeroth', 'Kalimdor'] }
  ]
}

//  #endregion

//  #region Helper Function
function findOrAddContact(contactList: any[], contact: any): number {
  // Check if the contact already exists based on phone and email
  const existingContact = contactList.find(
    (item) => item.phone === contact.phone && item.email.toLocaleLowerCase() === contact.email.toLocaleLowerCase()
  );

  if (existingContact) {
    // If records exist, return the existing contact ID
    return existingContact.id;
  }

  // Otherwise, create a new contact with a new ID assigned
  const newId = contactList.length + 1;
  const newContact = { id: newId, ...contact };
  contactList.push(newContact);

  return newId;
}
//  #endregion

export default [
  // #region USER
  // 1) user login: match username & password
  {
    url: '/api/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body

      const validateUser = createUserList().find(
        (item) => item.username === username && item.password === password
      )

      if (!validateUser) {
        return { code: 201, data: { message: 'Wrong Username or Password' } }
      }

      const { userId, token, roles } = validateUser
      return { code: 200, data: { userId, token, roles } }
    }
  },
  // 2) retrieve user info: match token
  {
    // url: '/api/user/:userId',
    url: '/api/user/info',
    method: 'get',
    response: (request) => {
      const token = request.headers.token

      const validateUser = createUserList().find((item) => item.token === token)

      if (!validateUser) {
        return {
          code: 201,
          data: { message: 'Fail to fetch user info: Invalid Token' }
        }
      }

      const { username, roles } = validateUser
      return { code: 200, data: { username, roles } }
    }
  },
  // 3) retrieve user name: match userId
  {
    url: '/api/user/name',
    method: 'get',
    response: (config) => {
      const { userId } = config.query
      const parsedUserId = Number(userId)
      if (isNaN(parsedUserId)) {
        return {
          code: 400,
          data: { message: 'Fail to fetch user info: Invalid UserId type' }
        }
      }

      const validateUser = createUserList().find((item) => item.userId === parsedUserId)

      if (!validateUser) {
        return {
          code: 201,
          data: { message: 'Fail to fetch user info: Invalid UserId' }
        }
      }

      const { username } = validateUser
      return { code: 200, data: { username } }
    }
  },
  //  #endregion

  // #region UPC
  // 1) READ: retrieve a upc list based on given parameters
  {
    url: '/api/upc/list',
    method: 'get',
    response: (config) => {
      const {
        currentPage,
        size,
        totalPages,
        upcCode,
        name,
        manufacturer,
        material,
        beverageType,
        completeUPCInfo,
        volumeMin,
        volumeMax,
        scanDateMin,
        scanDateMax
      } = config.query

      const page = parseInt(currentPage) || 1
      const limit = parseInt(size) || 10
      const total = parseInt(totalPages) || 5
      const completeUPCOnly = completeUPCInfo?.toLocaleLowerCase?.() === 'true'

      // Partial search on upcCode & name if provided
      const upcList = createUPCList().filter(
        (item) =>
          (upcCode === undefined ||
            upcCode === '' ||
            item.upcCode.toLocaleLowerCase().includes(upcCode.toLocaleLowerCase())) &&
          (name === undefined ||
            name === '' ||
            (item.name !== undefined &&
              item.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()))) &&
          (manufacturer === undefined ||
            manufacturer === '' ||
            (item.manufacturer !== undefined &&
              item.manufacturer.toLocaleLowerCase().includes(manufacturer.toLocaleLowerCase()))) &&
          (material === undefined ||
            material === '' ||
            (item.material !== undefined &&
              item.material.toLocaleLowerCase() === material.toLocaleLowerCase())) &&
          (beverageType === undefined ||
            beverageType === '' ||
            (item.beverageType !== undefined &&
              item.beverageType.toLocaleLowerCase() === beverageType.toLocaleLowerCase())) &&
          (completeUPCOnly === false || completeUPCOnly === item.completeUPCInfo) &&
          (volumeMin === undefined ||
            volumeMin === '' ||
            (item.volumeSize !== undefined && item.volumeSize >= parseInt(volumeMin))) &&
          (volumeMax === undefined ||
            volumeMax === '' ||
            (item.volumeSize !== undefined && item.volumeSize <= parseInt(volumeMax))) &&
          (scanDateMin === undefined ||
            scanDateMin === '' ||
            (item.lastScanDate !== undefined &&
              new Date(item.lastScanDate) >= new Date(scanDateMin))) &&
          (scanDateMax === undefined ||
            scanDateMax === '' ||
            (item.lastScanDate !== undefined &&
              new Date(item.lastScanDate) <= new Date(scanDateMax)))
      )

      if (!upcList) {
        return { code: 201, data: { message: 'No UPC found' } }
      }

      // Suggest list: return 5 items (1 pages * 5 items per page)
      // Data table: return 50 items (5 pages * 10 items per page) since the current page
      const resList = upcList.filter(
        (item, index) => index < limit * (page + total - 1) && index >= limit * (page - 1)
      )

      return { code: 200, data: { count: resList.length, list: resList } }
    }
  },
  // 2) READ: retrieve a single upc info based on given upcCode
  {
    url: '/api/upc/info',
    method: 'get',
    response: (config) => {
      const { upcCode } = config.query

      if (!upcCode) {
        return { code: 400, data: { message: 'UPC code is required' } }
      }

      const upcList = createUPCList().filter(
        (item) => item.upcCode.toLocaleLowerCase() === upcCode.toLocaleLowerCase()
      )

      if (!upcList || upcList.length === 0) {
        return { code: 201, data: { message: 'No UPC found' } }
      }

      return { code: 200, data: { count: upcList.length, list: upcList } }
    }
  },

  // 3) UPDATE: edit a single upc info
  {
    url: '/api/upc/info',
    method: 'put',
    response: (config) => {
      const data = config.body

      if (!data) {
        return { code: 400, data: { message: 'UPC Info Lost' } }
      }

      // Step 1: find the corresponsive UPC
      const upcList = createUPCList()
      const index = upcList.findIndex(
        (item) => item.upcCode.toLocaleLowerCase() === data.upcCode.toLocaleLowerCase()
      )

      if (index === -1) {
        return { code: 404, data: { message: 'No UPC found' } }
        // return { code: 201, data: { message: 'Update UPC Failed. Go chase the DEV team' } }
      }

      // Step 2: update that UPC note - append the new note to the note history
      const updatedNotes = upcList[index].notes
        ? [...upcList[index].notes, data.notes[0]]
        : data.notes

      // Step 3: override the updated fields
      const updatedUPC = {
        ...upcList[index],
        ...data,
        weight: parseInt(data.weight),
        notes: updatedNotes
      }
      upcList[index] = updatedUPC

      // Step 4: for incomplete UPC, verify all fields and update to `COMPLETE`
      if (!updatedUPC.completeUPCInfo) {
        const fields = [
          'upcCode',
          'name',
          'manufacturer',
          'material',
          'beverageType',
          'volumeSize',
          'weight',
          'lastScanDate',
          'totalScanUnit',
          'notes'
        ]

        const isComplete = fields.every((field) => {
          const value = updatedUPC[field]
          return value !== undefined && value !== null && value !== ''
        })

        if (isComplete) updatedUPC.completeUPCInfo = true
      }

      // Step 5: print the updated upc list
      console.log(upcList)
      console.log('-----------')
      console.log(upcList[index])

      return { code: 200, data: { message: 'UPC Updated Successfully' } }
    }
  },

  // CREATE: add a single upc info
  {
    url: '/api/upc/info',
    method: 'post',
    response: (config) => {
      const data = config.body
      if (!data) {
        return { code: 400, data: { message: 'New UPC Info Lost' } }
      }

      const newUPC = data
      const upcList = createUPCList()

      // Step 1: prevent duplication
      const isRepeated = upcList.find(
        (item) => item.upcCode.toLocaleLowerCase() === newUPC.upcCode.toLocaleLowerCase()
      )

      if (isRepeated) {
        return { code: 409, data: { message: 'UPC Already Exists' } }
      }

      // Step 2: evaluate all fields and update to `COMPLETE` if necessary
      // TODO: based on the current setting, the 'lastScanDate' and 'totalScanUnit' fields must be empty.
      const fields = [
        'upcCode',
        'name',
        'manufacturer',
        'material',
        'beverageType',
        'volumeSize',
        'weight',
        'lastScanDate',
        'totalScanUnit',
        'notes'
      ]

      const isComplete = fields.every((field) => {
        const value = newUPC[field]
        return value !== undefined && value !== null && value !== ''
      })

      newUPC.completeUPCInfo = isComplete

      // Step 3: assign a new upcId & append to the list
      upcList.push({ ...newUPC, upcId: upcList.length + 1 })

      // Step 4: print the updated upc list
      console.log(upcList)
      console.log('-----------')
      console.log(upcList[upcList.length - 1])

      return { code: 200, data: { message: 'UPC Added Ssuccessfully' } }
    }
  },
  // 1) READ: retrieve an unknown upc list based on given parameters
  {
    url: '/api/upc/unknown-list',
    method: 'get',
    response: (config) => {
      const {
        currentPage,
        size,
        totalPages,
        upcCode,
        name,
        manufacturer,
        threshold,
        timeRange,
        state,
        nameStatus,
        manuStatus,
        ruleStatus,
        unassignedOnly,
        populateRules,
        unknownOnly,
      } = config.query

      const page = parseInt(currentPage) || 1
      const limit = parseInt(size) || 10
      const total = parseInt(totalPages) || 5
      const numScanned = parseInt(threshold)

      const nonAssignedOnly = unassignedOnly?.toLocaleLowerCase() === 'true'
      const getRules = populateRules?.toLocaleLowerCase() === 'true'
      const unknown = unknownOnly?.toLocaleLowerCase() === 'true'


      // Partial search on upcCode & name if provided
      const allToDo = createToDoData();
      const users = createUserList();
      const upcList = createUPCList().filter(
        (item) =>
          (upcCode === undefined ||
            '' ||
            item.upcCode.toLocaleLowerCase().includes(upcCode.toLocaleLowerCase())) &&
          (name === undefined ||
            '' ||
            (item.name !== undefined &&
              item.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()))) &&
          (manufacturer === undefined ||
            '' ||
            (item.manufacturer !== undefined &&
              item.manufacturer.toLocaleLowerCase().includes(manufacturer.toLocaleLowerCase()))) &&
            (!unknown || (unknown && !item.completeUPCInfo)) &&
          (!nameStatus || (nameStatus === 'Complete' && item.name) || (nameStatus === 'Missing' && (!item.name || item.name === ''))) &&
          (!manuStatus || (manuStatus === 'Complete' && item.manufacturer) || (manuStatus === 'Missing' && (!item.manufacturer || item.manufacturer === '')))
      )
      const result: any = []
      const statesAndRegions = createStatesAndRegions();
      const rules = createBillingList();
      upcList.forEach((upc) => {
        statesAndRegions.forEach((stateObj) => {
          if(state && state.toLocaleLowerCase() !== stateObj.state.toLocaleLowerCase()) return;
          let rulesInState = 0;
          stateObj.regions.forEach((region) => {
            if(getRules) {
              const activeRule = rules.find((rule) => 
                  (rule.upcCode === upc.upcCode) && 
                  (rule.startDate <= new Date()) && 
                  (!rule.endDate || rule.endDate > new Date()) && 
                  (rule.region === region))
                if(activeRule) rulesInState += 1;
            }
        })
            
        const validRuleQuantity = (!getRules || !ruleStatus || 
                (ruleStatus === 'Complete' && rulesInState === stateObj.regions.length) ||
                (ruleStatus === 'Missing' && rulesInState === 0) ||
                (ruleStatus === 'Partial' && rulesInState > 0 && rulesInState < stateObj.regions.length))
        const totalRuleStatus = rulesInState + '/' + stateObj.regions.length

        const assignedId = allToDo.find((todoitem) => (todoitem.status) && 
            (todoitem.state.toLocaleLowerCase() === stateObj.state.toLocaleLowerCase()) &&
            (todoitem.upcCode === upc.upcCode))?.userID
        const assignedUser = users.find((user) => user.userId === assignedId)?.username
        const assigned = assignedUser?.substring(0, assignedUser.indexOf('@'))
        
          
        // calculate the total number of unpaid units in stateObj.state. Needs to be implemented with actual DB, since we can't mock this data.
        // this calculation will involve the upc, the state, the threshold, and the timeRange (which is used to establish how far back to count unpaid units)
        if(upc.totalScanUnit >= numScanned && validRuleQuantity && (!nonAssignedOnly || !assigned)) {
          result.push({...upc, appearingState: stateObj.state, unitsInState: upc.totalScanUnit, ruleStatus: totalRuleStatus, assignedTo: assigned })
        }
      })})
      
      result.sort(function(a, b) {
        return b.unitsInState - a.unitsInState;
      });

      if (!result) {
        return { code: 201, data: { message: 'No UPC found' } }
      }

      // Suggest list: return 5 items (1 pages * 5 items per page)
      // Data table: return 50 items (5 pages * 10 items per page) since the current page
      const resList = result.filter(
        (item, index) => index < limit * (page + total - 1) && index >= limit * (page - 1)
      )

      return { code: 200, data: { count: resList.length, list: resList } }
    }
  },
  //  #endregion

  // #region Company
  // 1) READ: retrieve a company list based on given params
  {
    url: '/api/company/list',
    method: 'get',
    response: (config) => {
      const { currentPage, size, totalPages, name, visible, noActiveRulesOnly, state, type } =
        config.query

      const visibility =
        visible !== undefined ? visible.toString().toLowerCase() === 'true' : undefined
      const noActiveOnly =
        noActiveRulesOnly !== undefined ? noActiveRulesOnly.toLocaleLowerCase?.() === 'true' : false
      const page = parseInt(currentPage) || 1
      const limit = parseInt(size) || 10
      const total = parseInt(totalPages) || 5

      // The `state` field involves specific states and '' for all states, which will be updated when attaching to the real database interface.

      const billingList = createBillingList()
      const upcList = createUPCList()
      let list
      let activeIds = new Set()

      const getActiveId = (key) => {
        return new Set(
          billingList
            .filter((b) => b.startDate <= new Date() && b.endDate && b.endDate >= new Date())
            .map((b) => b[key])
        )
      }

      switch (type?.toLowerCase()) {
        case 'manufacturer':
          list = createManufacturerList()
          // Step 1: Filter active UPCs from the billing list
          const activeUPCCodes = new Set(
            billingList
              .filter((b) => b.startDate <= new Date() && b.endDate && b.endDate >= new Date())
              .map((b) => b.upcCode)
          )

          // Step 2: Filter manufacturers with active UPCs
          activeIds = new Set(
            upcList
              .filter((upc) => activeUPCCodes.has(upc.upcCode)) // Filter UPCs that are active
              .map((upc) => upc.manufacturerId) // Extract the manufacturerId of active UPCs
          )
          break
        case 'initiator':
          list = createInitiatorList()
          activeIds = getActiveId('initiatorId')
          break
        case 'distributor':
          list = createDistributorList()
          activeIds = getActiveId('distributorId')
          break
        case 'pickup':
          list = createPickupList()
          activeIds = getActiveId('pickupAgentId')
          break
        default:
          return { code: 400, data: { message: `Invalid type ${type}` } }
      }

      const companyList = list.filter(
        (item) =>
          (name === undefined ||
            item.name.toLocaleLowerCase().includes(name.toLocaleLowerCase())) &&
          (visibility === undefined || item.visible === visibility) &&
          (!noActiveOnly || !activeIds.has(item.id)) &&
          (state === '' || item.states.includes(state))
      )

      if (!companyList) {
        return { code: 201, data: { message: `No ${type} found` } }
      }

      const resList = companyList.filter(
        (item, index) => index < limit * (page + total - 1) && index >= limit * (page - 1)
      )

      return { code: 200, data: { count: resList.length, list: resList } }
    }
  },
  // 2) READ: retrieve a single company info based on given params
  {
    url: '/api/company/info',
    method: 'get',
    response: (config) => {
      const { id, name, type, state } = config.query
      // Either ID or name must be provided.
      if (!(id || name) || !type || !state) {
        return { code: 400, data: { message: 'Missing required parameters' } }
      }

      const companyId = parseInt(id)
      if (id !== undefined && isNaN(companyId)) {
        return { code: 400, data: { message: 'Invalid parameter' } }
      }

      let list
      switch (type?.toLowerCase()) {
        case 'manufacturer':
          list = createManufacturerList()
          break
        case 'initiator':
          list = createInitiatorList()
          break
        case 'distributor':
          list = createDistributorList()
          break
        case 'pickup':
          list = createPickupList()
          break
        default:
          return { code: 400, data: { message: `Invalid type ${type}` } }
      }

      const companyList = list.filter(
        (item) =>
          (id === undefined || item.id === companyId) &&
          (name === undefined ||
            name === '' ||
            item.name.toLocaleLowerCase() === name.toLocaleLowerCase()) &&
          item.states.includes(state)
      )

      if (!companyList || companyList.length === 0) {
        return { code: 201, data: { message: `No ${type} found` } }
      }

      return { code: 200, data: { count: companyList.length, list: companyList } }
    }
  },
  // 3) UPDATE: edit a single company info
  {
    url: '/api/company/info',
    method: 'put',
    response: (config) => {
      const data = config.body

      if (!data) {
        return { code: 400, data: { message: 'Company Info Lost' } }
      }

      // Step 1: find the corresponsive company based on id & type
      let list
      switch (data.type?.toLowerCase()) {
        case 'manufacturer':
          list = createManufacturerList()
          break
        case 'initiator':
          list = createInitiatorList()
          break
        case 'distributor':
          list = createDistributorList()
          break
        case 'pickup':
          list = createPickupList()
          break
        default:
          return { code: 400, data: { message: `Invalid type ${data.type}` } }
      }

      const index = list.findIndex(
        (item) => item.id.toLocaleLowerCase() === data.id.toLocaleLowerCase()
      )

      if (index === -1) {
        return { code: 404, data: { message: 'No Company found' } }
      }

      // Step 2: update that Company note - append the new note to the note history
      const updatedNotes = list[index].notes ? [...list[index].notes, data.notes[0]] : data.notes

      // Step 3: override the updated fields
      const updatedCompany = {
        ...list[index],
        ...data,
        id: parseInt(data.id),
        notes: updatedNotes
      }
      list[index] = updatedCompany

      // Step 4: print the updated upc list
      console.log(list)
      console.log('-----------')
      console.log(list[index])

      return { code: 200, data: { message: 'UPC Updated Successfully' } }
    }
  },
  // 4) CREATE: add a single company info
  {
    url: '/api/company/info',
    method: 'post',
    response: (config) => {
      const data = config.body
      if (!data) {
        return { code: 400, data: { message: 'New Company Info Lost' } }
      }

      const newCompany = data
      console.log(newCompany);
      console.log("------");

      // Step 1: find the corresponsive company list based on type
      let list
      switch (newCompany.type?.toLowerCase()) {
        case 'manufacturer':
          list = createManufacturerList()
          break
        case 'initiator':
          list = createInitiatorList()
          break
        case 'distributor':
          list = createDistributorList()
          break
        case 'pickup':
          list = createPickupList()
          break
        default:
          return { code: 400, data: { message: `Invalid type ${data.type}` } }
      }

      // Step 2: prevent duplication
      const isRepeated = list.find(
        (item) => item.name.toLocaleLowerCase() === newCompany.name.toLocaleLowerCase()
      )

      if (isRepeated) {
        return { code: 409, data: { message: 'Company Already Exists' } }
      }

      // Step 3: update contact table & retrieve contactID
      const contactList = createContactList();
      const primaryContactId = findOrAddContact(contactList, newCompany.primaryContact);
      const secondaryContactId = newCompany.secondaryContact.map((contact: any) => {
        return findOrAddContact(contactList, contact);
      });

      // Step 4: attach contactID to the company info
      newCompany.primaryContactId = primaryContactId;
      newCompany.secondaryContactId = secondaryContactId;
      console.log(contactList)

      // Step 5: assign a new ompany Id & append to the list
      list.push({ id: list.length + 1, ...newCompany })

      // Step 6: print the updated company list
      console.log(list)
      console.log('-----------')
      console.log(list[list.length - 1])

      return { code: 200, data: { message: `${data.type} Added Successfully` } }
    }
  },
  // 5) UPDATE: edit a single company info by adding new notes only -------------------------- TODO: can merge into the edit part
  {
    url: '/api/company/note',
    method: 'put',
    response: (config) => {
      const data = config.body

      if (!data) {
        return { code: 400, data: { message: 'Company Info Lost' } }
      }

      // Step 1: find the corresponsive company based on id & type
      let list
      switch (data.type?.toLowerCase()) {
        case 'manufacturer':
          list = createManufacturerList()
          break
        case 'initiator':
          list = createInitiatorList()
          break
        case 'distributor':
          list = createDistributorList()
          break
        case 'pickup':
          list = createPickupList()
          break
        default:
          return { code: 400, data: { message: `Invalid type ${data.type}` } }
      }

      const index = list.findIndex((item) => item.id.toString() === data.id)

      if (index === -1) {
        return { code: 404, data: { message: 'No Company found' } }
      }

      // Step 2: update that Company note - append the new note to the note history
      const updatedNotes = list[index].notes ? [...list[index].notes, data.note] : data.notes

      // Step 3: override the updated fields
      const updatedCompany = {
        ...list[index],
        // id: parseInt(data.id),
        notes: updatedNotes
      }
      list[index] = updatedCompany

      // Step 4: print the updated upc list
      console.log(list)
      console.log('-----------')
      console.log(list[index])

      return { code: 200, data: { message: 'Company Updated Successfully' } }
    }
  },
  // 5) READ: retrieve the pickup processing fee for distributor ONLY
  {
    url: '/api/company/pickup',
    method: 'get',
    response: (config) => {
      const { id, state } = config.query

      if (!id && !state) {
        return { code: 400, data: { message: 'Missing required parameters: company ID or state' } }
      }

      const pickupStateList = createPickupFeeStateList()
      const pickupCompanyList = createPickupFeeCompanyList()

      // TODO
      // Step 0: find the `needsNegRates` field in the company list
      // if needsNegRates, directly go check the pickupCompanyList; else find in pickupStateList

      // Step 1: find the corresponsive company-based fee with higher priority
      if (id) {
        const companyId = parseInt(id)
        if (isNaN(companyId)) {
          return { code: 400, data: { message: 'Invalid Company ID' } }
        }

        const feeList = pickupCompanyList.filter((item) => item.companyId === companyId)
        if (feeList && feeList.length === 1) {
          return { code: 200, data: { count: feeList.length, list: feeList } }
        }
      }

      // Step 2: find the corresponsive state-based fee if no negotiated fee recorded
      if (state) {
        const feeList = pickupStateList.filter(
          (fee) => fee.state.toLocaleLowerCase() === state.toLocaleLowerCase()
        )
        if (feeList && feeList.length === 1) {
          return { code: 200, data: { count: feeList.length, list: feeList } }
        }
      }

      return {
        code: 201,
        data: { message: 'No pickup fee information found for the given company' }
      }
    }
  },
  //  #endregion

  // #region Fee
  // READ: retrieve a distributor list based on given params ----------- Can be merged into '/api/company/list'
  {
    url: '/api/distributor/list',
    method: 'get',
    response: (config) => {
      const { currentPage, size, totalPages, name, visible, noActiveRulesOnly, state } =
        config.query

      const visibility = visible === undefined ? undefined : visible.toLowerCase() === 'true'
      const noActiveOnly =
        noActiveRulesOnly === undefined ? false : noActiveRulesOnly.toLocaleLowerCase?.() === 'true'
      const page = parseInt(currentPage) || 1
      const limit = parseInt(size) || 10
      const total = parseInt(totalPages) || 5

      // The `state` field involves specific states, which will be updated when attaching to the real database interface.
      console.log(state)

      // Step 1: filter active rules: start before today & end after today
      // Step 2: filter distrobutor in active rules based on ID
      const billingList = createBillingList()
      const activeIds = new Set(
        billingList.map(
          (b) =>
            (b.startDate <= new Date()) &&
            (b.endDate && b.endDate >= new Date()) &&
            (b.distributorId)
        )
      )

      // Support partial search name
      const companyList = createDistributorList().filter(
        (item) =>
          (name === undefined ||
            item.name.toLocaleLowerCase().includes(name.toLocaleLowerCase())) &&
          (visibility === undefined || item.visible === visibility) &&
          (!noActiveOnly || !activeIds.has(item.id))
      )

      if (!companyList) {
        return { code: 201, data: { message: 'No distributor found' } }
      }

      const resList = companyList.filter(
        (item, index) => index < limit * (page + total - 1) && index >= limit * (page - 1)
      )

      return { code: 200, data: { count: resList.length, list: resList } }
    }
  },
  //  #endregion

  // #region TODO
  // 1) READ: retrieve a to do list based on given parameters
  {
    url: '/api/todo/list',
    method: 'get',
    response: (config) => {
      const {
        currentPage,
        size,
        totalPages,
        upcCode,
        name,
        manufacturer,
        prodStatus,
        billingStatus,
        timeRange,
        state,
        userid
      } = config.query

      const page = parseInt(currentPage)
      const limit = parseInt(size)
      const total = parseInt(totalPages)

      // Get a date object for the current time
      let timeFormat = new Date()
      // Set it to one month ago
      switch (timeRange.toString()) {
        case 'One Month':
          timeFormat.setMonth(timeFormat.getMonth() - 1)
          break
        case 'Six Months':
          timeFormat.setMonth(timeFormat.getMonth() - 6)
          break
        case 'One Year':
          timeFormat.setFullYear(timeFormat.getFullYear() - 1)
          break
        case 'Five Years':
          timeFormat.setFullYear(timeFormat.getFullYear() - 5)
          break
        case 'All Time':
          timeFormat = new Date('2000-01-01')
          break
      }

      // Zero the time component
      timeFormat.setHours(0, 0, 0, 0)
      console.log(userid)

      // timeFormat can now be used to calculate UnitsInState! TBA with database access.

      const data1 = createToDoData().filter(
        (item) =>
          userid.toString() === item.userID.toString() &&
          item.status &&
          (!state || item.state?.toLocaleLowerCase() === state.toLocaleLowerCase())
      )
      console.log(data1)
      const upcEntries = createUPCList()
      console.log('time')
      const rules = createBillingList()
      const stateData = createStatesAndRegions()

      const populated: any = []
      data1.forEach((todoitem) => {
        const foundUPC = upcEntries.find(
          (upcitem) => upcitem.upcCode.toLocaleLowerCase() === todoitem.upcCode.toLocaleLowerCase()
        )
        const regions = stateData?.find(
          (stateEntry) => stateEntry.state.toLocaleLowerCase() === todoitem.state.toLowerCase()
        )?.regions
        const numRules = rules.filter((rule) => {
          return (
            rule.upcCode.toLocaleLowerCase() === foundUPC?.upcCode.toLocaleLowerCase() &&
            regions?.includes(rule.region)
          )
        }).length
        if (!foundUPC) return
        if (
          (!manufacturer ||
            manufacturer === '' ||
            (manufacturer && foundUPC?.manufacturer === manufacturer)) &&
          (upcCode === undefined ||
            upcCode === '' ||
            foundUPC.upcCode.toLocaleLowerCase().includes(upcCode.toLocaleLowerCase())) &&
          (name === undefined ||
            '' ||
            (foundUPC.name !== undefined &&
              foundUPC.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()))) &&
          (!prodStatus ||
            (prodStatus === 'Missing' &&
              !foundUPC.completeUPCInfo &&
              Object.values(foundUPC).find((field) => !field)) ||
            (prodStatus === 'Partial' && !foundUPC.completeUPCInfo) ||
            (prodStatus === 'Complete' && foundUPC.completeUPCInfo)) &&
          (!billingStatus ||
            (billingStatus === 'Missing' && numRules === 0) ||
            (billingStatus === 'Partial' && numRules > 0) ||
            (billingStatus === 'Complete' && numRules === regions?.length))
        )
          populated.push({
            upc: foundUPC,
            state: todoitem.state,
            userID: todoitem.userID,
            billingRuleCount: todoitem.state ? numRules : '',
            expectedTotal: todoitem.state ? regions?.length : '',
            status: todoitem.status
          })
      })

      const resList = populated.filter(
        (item, index) => index < limit * (page + total - 1) && index >= limit * (page - 1)
      )

      return { code: 200, data: { count: resList.length, list: resList } }
    }
  },
  // CREATE: add a to-do item
  {
    url: '/api/todo/add',
    method: 'post',
    response: (config) => {
      const { upcCode, state, userID } = config.body

      const data = config.body
      if (!upcCode || !userID) {
        return { code: 400, data: { message: 'New to-do item Info Lost' } }
      }

      const upc = createUPCList().find((upc) => upc.upcCode === upcCode)
      if (!upc) {
        return { code: 500, data: { message: 'UPC Not Found' } }
      }

      const newToDo = {
        upcCode,
        state,
        userID
      }
      const todoItems = createToDoData()

      // check if UPC is already in someone else's to-do list in the given state
      // if so, deactivate that entry and proceed

      const existingToDoItem = todoItems.findIndex((item) => {
        return (
          item.status &&
          item.upcCode.toString() === newToDo.upcCode.toString() &&
          item.state.toLocaleLowerCase() === newToDo.state.toLocaleLowerCase()
        )
      })

      if (existingToDoItem >= 0 && todoItems[existingToDoItem].userID !== userID) {
        const deactivated = {
          upcCode: todoItems[existingToDoItem].upcCode,
          state: todoItems[existingToDoItem].state,
          userID: todoItems[existingToDoItem].userID,
          status: false,
          todoid: todoItems[existingToDoItem].todoid
        }
        todoItems[existingToDoItem] = deactivated
      }

      // add the new todo item record and show it as active
      todoItems.push({ ...newToDo, todoid: todoItems.length + 1, status: true })

      // Step 4: print the updated upc list
      console.log(todoItems)
      console.log('-----------')
      console.log(todoItems[todoItems.length - 1])

      return { code: 200, data: { message: 'To-Do Item Added Successfully' } }
    }
  },
  // DELETE: remove a to-do item
  {
    url: '/api/todo/remove',
    method: 'post',
    response: (config) => {
      const { upcCode, state, userID } = config.body

      const data = config.body
      if (!upcCode || !userID) {
        return { code: 400, data: { message: 'Deletion To-Do Item Info Lost' } }
      }

      const todoItems = createToDoData()

      // check if UPC is already in someone else's to-do list in the given state
      // if so, deactivate that entry and proceed

      const existingToDoItem = todoItems.findIndex((item) => {
        return (
          item.status &&
          item.upcCode.toString() === upcCode.toString() &&
          item.state.toLocaleLowerCase() === state.toLocaleLowerCase() &&
          item.userID.toString() === userID.toString()
        )
      })

      if (existingToDoItem >= 0) {
        const updated = {
          upcCode: todoItems[existingToDoItem].upcCode,
          state: todoItems[existingToDoItem].state,
          userID: todoItems[existingToDoItem].userID,
          status: false,
          todoid: todoItems[existingToDoItem].todoid
        }
        todoItems[existingToDoItem] = updated
      }

      // Step 4: print the updated upc list
      console.log(todoItems.filter((item) => item.status))
      console.log('-----------')
      console.log(todoItems[todoItems.length - 1])

      return { code: 200, data: { message: 'To-Do Item Added Successfully' } }
    }
  },

  //  #endregion

  // #region Billing
  // 1) READ: get a list of billing rules matching the search criteria
  {
    url: '/api/br/list',
    method: 'get',
    response: (config) => {
      const {
        distributor,
        pickupAgent,
        'regions[]': regions,
        initiator,
        active,
        startDate,
        endDate,
        upcCode,
        prodName,
        manufacturer,
        state,
        'upcs[]': upcs,
        ruleId
      } = config.query
      const upcSourceData = createUPCList()

      console.log(config.query)

      if (ruleId) {
        const foundRule = createBillingList().find((rule) => rule.id === ruleId)
        if (foundRule) return { code: 200, data: { count: 1, list: [foundRule] } }
      }

<<<<<<< HEAD
      const rules = createBillingList().filter((rule) => {
        const relevantUPC = upcSourceData.find((upc) => upc.upcCode === rule.upcCode)
        console.log('param:', startDate, 'rule:', rule.startDate)
=======
      let rules = createBillingList().filter((rule) => {
        const relevantUPC = upcSourceData.find((upc) => upc.upcCode === rule.upcCode)
        const dateStatus =
          (!startDate || rule.startDate >= new Date(startDate)) &&
          (!endDate || !rule.endDate || rule.endDate <= new Date(endDate))
        const activeStatus =
          !active ||
          active === 'false' ||
          (rule.startDate <= new Date() && (!rule.endDate || rule.endDate >= new Date()))
>>>>>>> c172d667188988efd9e5aead3e856606dd365695
        return (
          (!upcCode || rule.upcCode.toLocaleLowerCase().includes(upcCode.toLocaleLowerCase())) &&
          (!prodName || relevantUPC?.name?.toLocaleLowerCase().includes(prodName)) &&
          (!manufacturer ||
<<<<<<< HEAD
            relevantUPC?.manufacturer?.toLocaleLowerCase().includes(manufacturer)) &&
          (!regions || regions.includes(rule.region)) &&
=======
            relevantUPC?.manufacturer
              ?.toLocaleLowerCase()
              .includes(manufacturer.toLocaleLowerCase())) &&
          (!regions || regions.length === 0 || regions.includes(rule.region)) &&
>>>>>>> c172d667188988efd9e5aead3e856606dd365695
          (!state || rule.state.toLocaleLowerCase() === state.toLocaleLowerCase()) &&
          (!distributor ||
            distributor === '' ||
            rule.distributor.toLocaleLowerCase().includes(distributor.toLocaleLowerCase())) &&
          (!pickupAgent ||
            rule.pickupAgent.toLocaleLowerCase().includes(pickupAgent.toLocaleLowerCase())) &&
          (!initiator ||
            rule.initiator.toLocaleLowerCase().includes(initiator.toLocaleLowerCase())) &&
<<<<<<< HEAD
          (!startDate || rule.startDate >= new Date(startDate)) &&
          (!endDate || !rule.endDate || rule.endDate <= new Date(endDate)) &&
          (!active ||
            (rule.startDate <= new Date() && (!rule.endDate || rule.endDate >= new Date())))
=======
          dateStatus &&
          activeStatus
>>>>>>> c172d667188988efd9e5aead3e856606dd365695
        )
      })

      if (upcs && upcs.length > 0) {
        rules = rules.filter((rule) => {
          return upcs.includes(rule.upcCode)
        })
      }

      const output: any[] = []
      rules.forEach((rule) =>
        output.push({ ...rule, upc: upcSourceData.find((upc) => rule.upcCode === upc.upcCode) })
      )

      return { code: 200, data: { count: output.length, list: output } }
    }
  },
  // 2) READ: get the number of billing rules a UPC has in a state
  {
    url: '/api/br/rulecount',
    method: 'get',
    response: (config) => {
      const { upcCode, state } = config.query

      const upc = createUPCList().find((item) => item.upcCode === upcCode)

      const regions = createStatesAndRegions().find(
        (item) => item.state.toLocaleLowerCase() === state.toLocaleLowerCase()
      )?.regions
      const now = new Date()
      const activeRules = createBillingList().filter((rule) => {
        return (
          rule.upcCode === upcCode &&
          regions?.includes(rule.region) &&
          rule.startDate <= now &&
          (!rule.endDate || now < rule.endDate)
        )
      })

      const output = activeRules.length + '/' + regions?.length

      return { code: 200, data: { info: output } }
    }
  },
  // 3) "Update" the given billing rules with the new information
  {
    url: '/api/br/add',
    method: 'post',
    response: (config) => {
      const { newRules } = config.body

      const ruleDB = createBillingList()
      // console.log(newRules);
      const initSize = ruleDB.length
      console.log(
        'initial:',
        ruleDB.filter(
          (rule) => rule.upcCode.includes('005') && rule.state.toLocaleLowerCase() === 'new york'
        )
      )

      try {
        newRules.forEach((newRule) => {
          newRule.startDate = new Date(newRule.startDate)
          // console.log("date before is", new Date(newRule.startDate - 86400000));

          if (newRule.endDate) newRule.endDate = new Date(newRule.endDate)
          const existingActiveRule = ruleDB.find((oldRule) => {
            return (
              oldRule.upcCode === newRule.upcCode &&
              oldRule.region === newRule.region &&
              !(
                (oldRule.endDate && oldRule.endDate < newRule.startDate) ||
                (newRule.endDate && oldRule.startDate > newRule.endDate)
              )
            )
          })
          if (existingActiveRule) {
            const location = ruleDB.indexOf(existingActiveRule)
            ruleDB[location] = {
              ...ruleDB[location],
              endDate: new Date(newRule.startDate - 86400000)
            }
          }
          newRule.id = ruleDB.length + 1
          ruleDB.push(newRule)
        })
      } catch {
        console.log('crashed')
      }

      console.log(ruleDB.length === initSize + newRules.length)
      console.log(
        'at the end:',
        ruleDB.filter(
          (rule) => rule.upcCode.includes('005') && rule.state.toLocaleLowerCase() === 'new york'
        )
      )
      if (ruleDB.length === initSize + newRules.length) {
        return { code: 200, data: { message: 'Rules successfully added.' } }
      } else {
        // roll back changes, then return
        return { code: 400, data: { message: 'Rule Update Failed' } }
      }
    }
  },
  // 4) assign the given end date to the given rules
  {
    url: '/api/br/end',
    method: 'post',
    response: (config) => {
      const { rules, endDate } = config.body

      const newEnd = new Date(endDate)

      const ruleDB = createBillingList()

      const ruleIds = rules.map((rule) => rule.id)
      const rulesToEdit = ruleDB.filter((rule) => ruleIds.includes(rule.id))
      rulesToEdit.forEach((rule) => {
        const location = ruleDB.indexOf(rule)
        ruleDB[location] = { ...rule, endDate: newEnd }
      })

      return { code: 200, data: { message: 'yay!' } }
    }
  }
  // #endregion
]
