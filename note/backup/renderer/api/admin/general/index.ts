import { request } from '@/renderer/utils/request'
import type {
  ReqReadCompanyInfo,
  ReqReadCompanyTable,
  ResReadCompanyList,
  ReqAddCompanyNote,
  Company,
  ResParams
} from './type'

/** READ - Search for companies based on keywords */
export function getCompanyList(params: ReqReadCompanyTable) {
  return request<ResReadCompanyList>({
    url: 'company/list',
    method: 'get',
    params
  })
}

/** READ - Retrieve details for a specific company based on ID (name may have duplications) */
export function getCompanyInfo(params: ReqReadCompanyInfo) {
  return request<ResReadCompanyList>({
    url: 'company/info',
    method: 'get',
    params
  })
}

/** UPDATE - edit a specific company */
export function updateCompanyInfo(data: Company) {
  return request<ResParams>({
    url: 'company/info',
    method: 'put',
    data
  })
}

/** ADD - add a specific company */
export function addCompanyInfo(data: Company) {
  return request<ResParams>({
    url: 'company/info',
    method: 'post',
    data
  })
}

/** UPDATE - add notes to a specific company */
export function addCompanyNote(data: ReqAddCompanyNote) {
  return request<ResParams>({
    url: 'company/note',
    method: 'put',
    data
  })
}
