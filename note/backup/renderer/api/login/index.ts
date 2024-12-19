import { request } from '@/renderer/utils/request'
import type { LoginReqParams, LoginResParams, UserResParams } from './type'

enum API {
  LOGIN_URL = '/login',
  USERINFO_URL = '/user/info',
  LOGOUT_URL = '/logout',
  USERNAME_URL = '/user/name'
}

// Pass the data argument for login
export function reqLogin(data: LoginReqParams) {
  return request<LoginResParams>({
    url: API.LOGIN_URL,
    method: 'post',
    data
  })
}

export function reqUserInfo() {
  return request<UserResParams>({
    url: API.USERINFO_URL,
    method: 'get'
  })
}

export function reqLogout() {
  return request<any>({
    url: API.LOGOUT_URL,
    method: 'post'
  })
}

// Fetch username for note editors based on userId
export function reqUserName(params: string) {
  return request<UserResParams>({
    url: API.USERNAME_URL,
    method: 'get',
    params
  })
}
