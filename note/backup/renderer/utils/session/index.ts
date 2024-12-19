/** Manage session expiration */
import {
  SessionKey,
  getSessionData,
  updateGeneralSessionTimestamp,
  updateAdminSessionTimestamp,
  removeSessionData,
  removeAdminSessionData
} from '@/renderer/utils/cache/sessionStorage'
import { sessionSettings, defaultSession, adminSession } from '@/renderer/config/session'
import router from '@/renderer/router'

/** Check whether the session expires */
export const isSessionExpired = (setting: sessionSettings, key: SessionKey) => {
  if (setting.enable) {
    const currentTime = new Date().getTime()
    const session = getSessionData(key)
    const lastTime = session?.timestamp as number

    return currentTime - lastTime > (setting.stagnateTime as number)
  }
}

/** Expire session
 * - General session expired: log out & clear session storage
 * - Admin session expired: allow to re-authentication */
export const handleSessionExpiration = (setting: sessionSettings, key: SessionKey) => {
  if (isSessionExpired(setting, key)) {
    // general session
    if (setting.clearAll) {
      alert('You have been inactive for too long. You will be logged out.')
      removeSessionData()
      router.push('login')
    }
    // admin session
    else {
      removeAdminSessionData()
      router.push('/admin/auth')
    }
  } else {
    updateGeneralSessionTimestamp()
    updateAdminSessionTimestamp()
  }
}

/** Update session by tracking user behaviors */
export const startActivityTracker = () => {
  window.addEventListener('mousemove', updateGeneralSessionTimestamp)
  window.addEventListener('keydown', updateGeneralSessionTimestamp)
  window.addEventListener('mousemove', updateAdminSessionTimestamp)
  window.addEventListener('keydown', updateAdminSessionTimestamp)

  return () => {
    // Cleanup listeners when not needed
    window.removeEventListener('mousemove', updateGeneralSessionTimestamp)
    window.removeEventListener('keydown', updateGeneralSessionTimestamp)
    window.removeEventListener('mousemove', updateAdminSessionTimestamp)
    window.removeEventListener('keydown', updateAdminSessionTimestamp)
  }
}

/** Watch session at regular intervals (detectTime) */
export const startSessionWatcher = (setting: sessionSettings, key: SessionKey) => {
  const intervalId = setInterval(() => {
    if (isSessionExpired(setting, key)) {
      handleSessionExpiration(setting, key)
      // Terminate checking after logout
      clearInterval(intervalId)
    }
  }, setting.detectTime)

  // Cleanup on logout or when not needed
  return () => clearInterval(intervalId)
}
