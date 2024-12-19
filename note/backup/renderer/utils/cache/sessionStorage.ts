/** Manage sessionStorage: token */

import CacheKey from '@/renderer/constants/cacheKey'

interface SessionData {
  timestamp: number
  userId: string
  token: string
}

export type SessionKey = typeof CacheKey.SESSION_DATA | typeof CacheKey.SESSION_ADMIN

export const getSessionData = (key: SessionKey): SessionData | null => {
  const data = sessionStorage.getItem(key)
  return data ? JSON.parse(data) : null
}

export const setSessionData = (key: SessionKey, userId: string, token: string) => {
  const sessionData: SessionData = {
    timestamp: Date.now(),
    userId,
    token
  }
  sessionStorage.setItem(key, JSON.stringify(sessionData))
}

export const updateSessionTimestamp = (key: SessionKey) => {
  const sessionData = getSessionData(key)
  if (sessionData) {
    sessionData.timestamp = Date.now()
    sessionStorage.setItem(key, JSON.stringify(sessionData))
  }
}

export const removeSessionData = () => {
  sessionStorage.removeItem(CacheKey.SESSION_DATA)
  sessionStorage.removeItem(CacheKey.SESSION_ADMIN)
}

// #region General
export const updateGeneralSessionTimestamp = () => updateSessionTimestamp(CacheKey.SESSION_DATA)
//  #endregion

// #region Admin
export const updateAdminSessionTimestamp = () => updateSessionTimestamp(CacheKey.SESSION_ADMIN)

export const removeAdminSessionData = () => {
  sessionStorage.removeItem(CacheKey.SESSION_ADMIN)
}
//  #endregion
