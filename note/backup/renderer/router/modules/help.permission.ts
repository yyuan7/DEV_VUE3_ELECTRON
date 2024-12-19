import router from '@/renderer/router'
import { useUserStoreHook } from '@/renderer/store/modules/userStore'
import { usePermissionStoreHook } from '@/renderer/store/modules/PermissionRouteStore'
import { useTagsViewStore } from '@/renderer/store/modules/tagStore'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
import { setRouteChange } from '@/renderer/hooks/useRouteListener'
import { useTitle } from '@/renderer/hooks/useTitle'
import { getSessionData } from '@/renderer/utils/cache/sessionStorage'
import { isWhiteList, isAdminWhiteList } from '@/renderer/config/whitelist'
import { defaultSettings } from '@/renderer/config/layout'
import { isSessionExpired } from '@/renderer/utils/session'
import { defaultSession, adminSession } from '@/renderer/config/session'
import CacheKey from '@/renderer/constants/cacheKey'

const { setTitle } = useTitle()

router.beforeEach(async (to, _from, next) => {
  const userStore = useUserStoreHook()
  const permissionStore = usePermissionStoreHook()
  const tagsViewStore = useTagsViewStore()
  const snackbarStore = useSnackbarStore()
  const token = getSessionData(CacheKey.SESSION_DATA)?.token
  const adminToken = getSessionData(CacheKey.SESSION_ADMIN)?.token

  // Case: no token or general-session expired -> login
  if (!token || isSessionExpired(defaultSession, CacheKey.SESSION_DATA)) {
    // Allow access if in the whitelist
    if (isWhiteList(to)) return next()

    return next('/login')
  }

  // Case: check tag restriction
  if (
    tagsViewStore.visitedViews.length >=
    defaultSettings.maxTagsView + defaultSettings.affixTagsView
  ) {
    const index = tagsViewStore.visitedViews.findIndex((v) => v.path === to.path)
    if (index === -1) {
      snackbarStore.showErrorMessage('Max Number of Tags Reached')
      return next({ path: _from.fullPath })
    }
  } else {
    await tagsViewStore.addVisitedView(to)
  }

  // Case: token + to the login page -> redirect to the home page
  if (to.path === '/login') {
    return next({ path: '/' })
  }

  // Case: no admin token or admin-session expired -> re-authentication
  if (to.meta.requiresAdmin) {
    if (!adminToken || isSessionExpired(adminSession, CacheKey.SESSION_ADMIN)) {
      if (isAdminWhiteList(to)) return next()

      return next('/admin/auth')
    }
  }

  // Case: have retrieved user roles
  if (userStore.roles.length !== 0) {
    return next()
  }

  // Case: no user roles -> fetch roles
  try {
    await userStore.getInfo()
    const roles = userStore.roles

    // Generate accessible routes based on the user roles
    permissionStore.setRoutes(roles)

    // Add the dynamically generated routes
    permissionStore.addRoutes.forEach((route) => router.addRoute(route))

    // Prevent history records for navigation
    return next({ ...to, replace: true })
  } catch (err: any) {
    // Error Case: reset token & redirect to the login page
    userStore.resetSession()
    snackbarStore.showErrorMessage(err.message || 'Error: route guard')
    return next('/login')
  }
})

router.afterEach((to) => {
  setRouteChange(to)
  setTitle(to.meta.title)
})
