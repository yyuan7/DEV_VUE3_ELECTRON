import { Note, Contact } from '@/renderer/api/common/type'

export interface Company {
  id?: string
  name?: string
  visible?: boolean
  states?: string[]
  addedByUserId?: string
  physAddress?: string
  invAddress?: string
  notes?: Note[]
  primaryContactId?: string
  secondaryContactId?: string[]
  // The database should only store ID as FK, and the backend will return contact details when fetching.
  primaryContact?: Contact
  secondaryContact?: Contact[]
  lastUpdatedDate?: string
  needsNegRates?: boolean // distributor ONLY
}

export interface ReqReadCompanyInfo {
  id?: string // company Id
  name?: string
  type: string // manufacturers vs initiator vs distributor vs pickup agent
  state: string
}

export interface ReqSearchCompany {
  name?: string
  visible?: boolean
  noActiveRulesOnly?: boolean
  state: string // manufacturers may fetch from all states in the UPC section
  type: string // manufacturers vs initiator vs distributor vs pickup agent
}

export interface ReqReadCompanyTable extends ReqSearchCompany {
  currentPage: number
  size: number // items loaded at one time
  totalPages: number // pages loaded at one time
}

export interface ReqCreateOrUpdateCompany extends Company {
  type: string // manufacturers vs initiator vs distributor vs pickup agent
}

export interface ResParams {
  code: number
  data: {
    message?: string
  }
}

export interface ResReadCompanyList extends ResParams {
  data: {
    message?: string
    list: Company[]
    count: number
  }
}

export interface ReqAddCompanyNote extends ReqReadCompanyInfo {
  note: Note
}

// export interface Lists {
//   states: string[]
//   distributors: string[]
//   types: string[]
//   materials: string[]
// }

// export interface StateCatRate {
//   state: string
//   category: string
//   rate: string
// }

// export interface NegotiatedRate {
//   distributor: string
//   material: string
//   rate: string
//   state: string
// }

// export interface Modification {
//   author: string
//   date: string
//   updateId: string
// }

// // The Note interface has been re-defined in api/common, which can be removed later
// export interface Note {
//   time: Date
//   user: string
//   msg: string
// }

// export interface PendingRateUpdate {
//   id: string
//   state: string
//   category: string
//   distributor?: string
//   amount: string
//   date: string
//   note: string
//   status: string
// }

// export interface CompanyMetadata {
//   primary: Contact
//   secondary: Contact
//   invoice: string
//   physical: string
//   status: boolean
// }
