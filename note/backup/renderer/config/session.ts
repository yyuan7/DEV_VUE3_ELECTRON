/** Default logout option - automatic logout */

export interface sessionSettings {
  enable?: boolean
  keyName?: string
  stagnateTime?: number
  detectTime?: number
  clearAll?: boolean
}

export const defaultSession: sessionSettings = {
  enable: true,
  keyName: 'token',
  stagnateTime: 30 * 60 * 1000, // 30 minutes
  // stagnateTime: 20 * 1000, // TEST ONLY
  detectTime: 10 * 1000,
  clearAll: true
}

export const adminSession: sessionSettings = {
  enable: true,
  keyName: 'token',
  // stagnateTime: 5 * 60 * 1000, // 5 minutes
  stagnateTime: 30 * 60 * 1000, // TEST ONLY
  // stagnateTime: 10 * 1000, // TEST ONLY
  detectTime: 10 * 1000,
  clearAll: false
}
