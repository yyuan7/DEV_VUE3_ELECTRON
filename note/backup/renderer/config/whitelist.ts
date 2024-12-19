/** Whitelists for routes that do not require user authentication */

import { type RouteLocationNormalized } from 'vue-router'

/** Path-based whitelist */
const whiteListByPath: string[] = ['/login']

/** Name-based whitelist */
const whiteListByName: string[] = []

export const isWhiteList = (to: RouteLocationNormalized) => {
  return whiteListByPath.indexOf(to.path) !== -1 || whiteListByName.indexOf(to.name as any) !== -1
}

/** Path-based whitelist */
const adminWhiteListByPath: string[] = ['/admin/auth']

/** Name-based whitelist */
const adminWhiteListByName: string[] = []

export const isAdminWhiteList = (to: RouteLocationNormalized) => {
  return (
    adminWhiteListByPath.indexOf(to.path) !== -1 ||
    adminWhiteListByName.indexOf(to.name as any) !== -1
  )
}
