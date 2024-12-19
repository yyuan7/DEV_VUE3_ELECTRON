/** CRUD parameter format */
import { BeverageType, MaterialType, SimpleStatus, StateType, Status, TimeRange } from '@/renderer/constants/upc'
import { Note } from '@/renderer/api/common/type'

export interface ReqSearchUpc {
  upcCode?: string
  name?: string
}

export interface ReqFilterUpc {
  manufacturer?: string
  material?: MaterialType
  beverageType?: BeverageType
  completeUPCInfo?: boolean
  volumeMin?: number | null
  volumeMax?: number | null
  scanDateMin?: string | null
  scanDateMax?: string | null
}

export interface ReqSearchOrFilterUpc extends ReqSearchUpc, ReqFilterUpc {}

export interface ReqReadUpcTable extends ReqSearchOrFilterUpc {
  currentPage: number
  size: number // items loaded at one time
  totalPages: number // pages loaded at one time
}

export interface ReqReadUnknownUpcTable extends ReqReadUpcTable {
  threshold: number
  timeRange: TimeRange
  state?: StateType
  nameStatus?: SimpleStatus
  manuStatus?: SimpleStatus
  unassignedOnly: boolean
  billingStatus?: Status
  populateRules: boolean
  ruleStatus?: Status
  unknownOnly: boolean
}

export interface ResParams {
  code: number
  data: {
    message?: string
  }
}

export interface UpcData {
  upcCode: string
  name?: string
  manufacturer?: string
  material?: MaterialType
  beverageType?: BeverageType
  completeUPCInfo?: boolean
  volumeSize?: number
  weight?: number
  firstScanDate?: string
  lastScanDate?: string
  totalScanUnit?: number
  notes?: Note[]
}

export interface PopulatedUPCData extends UpcData {
  assignedTo?: number
  ruleStatus?: string
  appearingState?: StateType
  unitsInState?: number
}

export interface ResReadUpcList extends ResParams {
  data: {
    message?: string
    list: UpcData[]
    count: number
  }
}

export interface ResReadUnknownUpcLists extends ResParams {
  data: {
    message?: string
    list: PopulatedUPCData[]
    count: number
  }
}
