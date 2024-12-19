import { request } from '@/renderer/utils/request'
import type {
  ReqSearchOrFilterUpc,
  ResReadUpcList,
  ReqReadUpcTable,
  ResParams,
  UpcData,
  ResReadUnknownUpcLists,
  ReqReadUnknownUpcTable
} from './type'

/** READ - Retrieve all UPCs */

/** READ - Search for UPCs based on keywords */
export function getUpcList(params: ReqReadUpcTable) {
  return request<ResReadUpcList>({
    url: 'upc/list',
    method: 'get',
    params
  })
}

/** READ - Retrieve details for a specific UPC based on upcCode */
export function getUpcInfo(upcCode: string) {
  return request<ResReadUpcList>({
    url: 'upc/info',
    method: 'get',
    params: { upcCode }
  })
}

/** UPDATE - edit a specific UPC */
export function updateUpcInfo(data: UpcData) {
  return request<ResParams>({
    url: 'upc/info',
    method: 'put',
    data
  })
}

/** ADD - add a specific UPC */
export function addUpcInfo(data: UpcData) {
  return request<ResParams>({
    url: 'upc/info',
    method: 'post',
    data
  })
}

/** READ - Search for UPCs based on keywords */
export function getUnknownUpcList(params: ReqReadUnknownUpcTable) {
  return request<ResReadUnknownUpcLists>({
    url: 'upc/unknown-list',
    method: 'get',
    params
  })
}
