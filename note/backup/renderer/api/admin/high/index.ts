import { request } from '@/renderer/utils/request'
import type { ReqReadCompanyPickupInfo, ResReadFeeList } from './type'

/** READ - Retrieve pickup processing fees for a specific company based on ID (name may have duplications) */
export function getCompanyPickupFee(params: ReqReadCompanyPickupInfo) {
  return request<ResReadFeeList>({
    url: 'company/pickup',
    method: 'get',
    params
  })
}
