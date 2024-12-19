import { StateType, Status, TimeRange } from '@/renderer/constants/upc'
import { UPC } from '../billing/type'
import { UpcData } from '../upc/type'

export interface ToDoItem {
  upcCode: string
  state: string
  userID: string
  status: boolean
}

export interface PopulatedToDoItem {
  upc: UpcData
  state: string
  userID: number
  billingRuleCount: string
  expectedTotal: string
  status: boolean
}

export interface ReqSearchToDo {
  upcCode?: string
  name?: string
}

export interface ReqFilterToDo {
  manufacturer?: string
  prodStatus?: Status
  billingStatus?: Status
  state?: StateType
  userid?: string
  timeRange?: TimeRange
}

export interface ReqSearchOrFilterToDo extends ReqSearchToDo, ReqFilterToDo {}

export interface ReqReadToDoTable extends ReqSearchOrFilterToDo {
  currentPage: number
  size: number // items loaded at one time
  totalPages: number // pages loaded at one time
  userid: string
}

export interface ResParams {
  code: number
  data: {
    message?: string
  }
}

export interface ResReadToDoList extends ResParams {
  data: {
    message?: string
    list: PopulatedToDoItem[]
    count: number
  }
}

export interface ReqBillingData {
  data: {
    upcCode: string
    state: string
  }
}
