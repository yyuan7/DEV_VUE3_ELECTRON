/** Global permission check function based on specified roles */

import { useUserStoreHook } from '@/renderer/store/modules/userStore'

export const checkPermission = (permissionRoles: string[]): boolean => {
  if (Array.isArray(permissionRoles) && permissionRoles.length > 0) {
    const { roles } = useUserStoreHook()
    return roles.some((role) => permissionRoles.includes(role))
  } else {
    console.error('Empty permissionRoles')
    return false
  }
}

export const checkAdminPermission = (): boolean => {
  const permissionRoles = ['admin', 'high-admin']
  return checkPermission(permissionRoles)
}

export const checkHighAdminPermission = (): boolean => {
  const permissionRoles = ['high-admin']
  return checkPermission(permissionRoles)
}
