import type { ReqBillingData, ReqReadToDoTable, ResParams, ResReadToDoList, ToDoItem } from './type'
import { request } from '@/renderer/utils/request'

export function getToDoList(params: ReqReadToDoTable) {
  return request<ResReadToDoList>({
    url: 'todo/list',
    method: 'get',
    params
  })
}

export function addToDoItem(data: ToDoItem) {
  return request<ResParams>({
    url: 'todo/add',
    method: 'post',
    data
  })
}

export function removeToDoItem(data: ToDoItem) {
  return request<ResParams>({
    url: 'todo/remove',
    method: 'post',
    data
  })
}
