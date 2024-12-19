import { BeverageType, MaterialType } from '@/renderer/constants/upc'
import { UpcData } from '../upc/type'

export interface RegionList {
  state: string
  regions: string[]
}

export interface SizeRange {
  min: number | null
  max: number | null
}

export interface BillingRule {
  id: number
  upcCode: string
  state: string
  region: string
  initiator: string
  distributor: string
  pickupAgent: string
  startDate: Date
  endDate?: Date
  dateAdded: Date
  author: string
}

export interface BetterBillingRule extends BillingRule {
  upc: UpcData
}

export interface RuleDisplay {
  ids: number[]
  upc: UpcData
  regions: string[]
  rules: BetterBillingRule[]
  ruleID: number
}

// searching for billing rules:
export interface ReqSearchBRules {
  upcCode?: string | null
  prodName?: string | null
  manufacturer?: string | null
}

export interface ReqFilterBRules {
  distributor?: string | null
  pickupAgent?: string | null
  regions?: string[]
  initiator?: string | null
  active?: boolean
  startDate?: Date | null
  endDate?: Date | null
  state?: string | null
  upcs?: string[] | null
  ruleId?: number | null
}

export interface ReqSearchOrFilterBRules extends ReqSearchBRules, ReqFilterBRules {}

export interface ReqReadBillingTable extends ReqSearchOrFilterBRules {
  currentPage: number
  size: number // items loaded at one time
  totalPages: number // pages loaded at one time
}

export interface ReqCountRules {
  upcCode: string
  state: string
}

export interface ResParams {
  code: number
  data: {
    message?: string
  }
}

export interface ReqAddRules {
  newRules: BillingRule[]
}

export interface ReqEndRules {
  rules: BillingRule[]
  endDate: Date
}

export interface ResReadBillingList extends ResParams {
  data: {
    message?: string
    list: BetterBillingRule[]
    count: number
  }
}

export interface ResReadBillingCount extends ResParams {
  data: {
    message?: string
    info: string
  }
}
