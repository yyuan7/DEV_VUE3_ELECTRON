import { ref } from 'vue'
import store from '@/renderer/store'
import { defineStore } from 'pinia'
import { type RouteRecordRaw } from 'vue-router'
import { constantRoutes, dynamicRoutes } from '@/renderer/router'
import { flatMultiLevelRoutes } from '@/renderer/router/modules/help.flat'

const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  const routeRoles = route.meta?.roles
  return routeRoles ? roles.some((role) => routeRoles.includes(role)) : true
}

const filterDynamicRoutes = (routes: RouteRecordRaw[], roles: string[]) => {
  const res: RouteRecordRaw[] = []
  routes.forEach((route) => {
    const tempRoute = { ...route }
    if (hasPermission(roles, tempRoute)) {
      if (tempRoute.children) {
        tempRoute.children = filterDynamicRoutes(tempRoute.children, roles)
      }
      res.push(tempRoute)
    }
  })
  return res
}

export const usePermissionStore = defineStore('permission', () => {
  const routes = ref<RouteRecordRaw[]>([])
  const addRoutes = ref<RouteRecordRaw[]>([])

  /** Generate routes based on roles (constant + authorized dynamic) */
  const setRoutes = (roles: string[]) => {
    const accessedRoutes = filterDynamicRoutes(dynamicRoutes, roles)
    _set(accessedRoutes)
  }

  const setAllRoutes = () => {
    _set(dynamicRoutes)
  }

  const _set = (accessedRoutes: RouteRecordRaw[]) => {
    routes.value = constantRoutes.concat(accessedRoutes)
    addRoutes.value = flatMultiLevelRoutes(accessedRoutes)
  }

  return { routes, addRoutes, setRoutes, setAllRoutes }
})

export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
