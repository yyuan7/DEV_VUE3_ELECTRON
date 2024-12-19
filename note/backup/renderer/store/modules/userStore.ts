import { ref } from 'vue'
import { defineStore } from 'pinia'
import store from '@/renderer/store'
import { useTagsViewStore } from './tagStore'
import { startActivityTracker, startSessionWatcher } from '@/renderer/utils/session'
import {
  getSessionData,
  setSessionData,
  updateSessionTimestamp,
  removeSessionData
} from '@/renderer/utils/cache/sessionStorage'
import { defaultSession, adminSession } from '@/renderer/config/session'
import { resetRouter } from '@/renderer/router'
import { reqLogin, reqUserInfo } from '@/renderer/api/login'
import { LoginReqParams, LoginResParams, UserResParams } from '@/renderer/api/login/type'
import routeSetting from '@/renderer/config/route'
import CacheKey from '@/renderer/constants/cacheKey'

export const useUserStore = defineStore('user', () => {
  const username = ref<string>('')
  const roles = ref<string[]>([])
  const token = ref<string>(getSessionData(CacheKey.SESSION_DATA)?.token || '')
  const userId = ref<string>(getSessionData(CacheKey.SESSION_DATA)?.userId || '')

  const tagsViewStore = useTagsViewStore()
  const sessionCleanup = ref<null | (() => void)>(null)

  /** Login */
  const login = async ({ username, password }: LoginReqParams) => {
    const result: LoginResParams = await reqLogin({ username, password })
    if (result.code === 200) {
      // Set general session data
      setSessionData(
        CacheKey.SESSION_DATA,
        result.data.userId as string,
        result.data.token as string
      )
      userId.value = result.data.userId as string
      token.value = result.data.token as string

      // Start session management
      const cleanupActivityTracking = startActivityTracker()
      const cleanupSessionWatcher = startSessionWatcher(defaultSession, CacheKey.SESSION_DATA)

      // Store cleanup methods for session management
      sessionCleanup.value = () => {
        cleanupActivityTracking()
        cleanupSessionWatcher()
      }

      return 'success'
    } else {
      return Promise.reject(new Error(result.data.message))
    }
  }

  /** Re-authenticate admin users */
  // const reAuth = async (password : string) => {
  const reAuth = async ({ username, password }: LoginReqParams) => {
    const result: LoginResParams = await reqLogin({ username, password })
    if (result.code === 200) {
      // Set admin session data
      setSessionData(
        CacheKey.SESSION_ADMIN,
        result.data.userId as string,
        result.data.token as string
      )

      // Start session management
      const cleanupActivityTracking = startActivityTracker()
      const cleanupSessionWatcher = startSessionWatcher(adminSession, CacheKey.SESSION_ADMIN)

      // Store cleanup methods for session management
      sessionCleanup.value = () => {
        cleanupActivityTracking()
        cleanupSessionWatcher()
      }

      return 'success'
    } else {
      return Promise.reject(new Error(result.data.message))
    }
  }

  /** Fetch user information and roles */
  const getInfo = async () => {
    const result: UserResParams = await reqUserInfo()
    if (result.code === 200) {
      username.value = result.data.username
      // Validate user roles
      // 1) fetched successfully
      // 2) set default roles to avoid infinite loop in route guarding
      roles.value = result.data.roles?.length > 0 ? result.data.roles : routeSetting.defaultRoles
    }
  }

  /** Log out */
  const logout = () => {
    // Perform session cleanup if defined
    if (sessionCleanup.value) {
      sessionCleanup.value()
      sessionCleanup.value = null // Clear the cleanup reference
    }

    // Remove session data
    removeSessionData()
    userId.value = ''
    token.value = ''
    roles.value = []
    resetRouter()
    resetTagsView()
  }

  /** TODO: Handle role change */
  const changeRoles = async (role: string) => {
    // const newToken = 'token-' + role
    // token.value = newToken
    // setToken(newToken)
    // Page refresh
    window.location.reload()
  }

  /** Reset the token & clear the roles */
  // const resetToken = () => {
  //   removeToken()
  //   token.value = ''
  //   roles.value = []
  // }

  /** Reset the userId + token & clear the roles */
  const resetSession = () => {
    removeSessionData()
    userId.value = ''
    token.value = ''
    roles.value = []
  }

  /** Reset the visited views and cached views */
  const resetTagsView = () => {
    tagsViewStore.delAllVisitedViews()
    tagsViewStore.delAllCachedViews()
  }

  // return { token, roles, username, login, getInfo, changeRoles, logout, resetToken, resetSession }
  return {
    token,
    roles,
    username,
    userId,
    login,
    reAuth,
    getInfo,
    changeRoles,
    logout,
    resetSession,
    sessionCleanup
  }
})

/** Provide a hook for access outside of the setup function */
export function useUserStoreHook() {
  return useUserStore(store)
}
