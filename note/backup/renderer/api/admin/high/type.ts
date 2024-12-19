// import { StateType } from '@/renderer/constants/upc'

export interface ReqReadCompanyPickupInfo {
  id: string // company Id
  // state: StateType
  state: string
}

export interface ResParams {
  code: number
  data: {
    message?: string
  }
}

export interface Fee {
  // state?: StateType
  state?: string
  companyId?: string
  glass?: number
  plastic?: number
  metal?: number
}

export interface ResReadFeeList extends ResParams {
  data: {
    message?: string
    list: Fee[]
    count: number
  }
}
