import type {
  BillingRule,
  ReqAddRules,
  ReqCountRules,
  ReqEndRules,
  ReqReadBillingTable,
  ResParams,
  ResReadBillingCount,
  ResReadBillingList
} from './type'
import { request } from '@/renderer/utils/request'

export function getBillingRuleList(params: ReqReadBillingTable) {
  return request<ResReadBillingList>({
    url: 'br/list',
    method: 'get',
    params
  })
}

export function getRulesForUPC(params: ReqCountRules) {
  return request<ResReadBillingCount>({
    url: 'br/rulecount',
    method: 'get',
    params
  })
}

export function addBillingRule(data: ReqAddRules) {
  return request<ResParams>({
    url: 'br/add',
    method: 'post',
    data
  })
}

export function endDateRules(data: ReqEndRules) {
  return request<ResParams>({
    url: 'br/end',
    method: 'post',
    data
  })
}
