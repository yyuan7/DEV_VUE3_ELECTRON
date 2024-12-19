const SYSTEM_NAME = 'clynk'

class CacheKey {
  static readonly SESSION_DATA = `${SYSTEM_NAME}-session-general`
  static readonly SESSION_ADMIN = `${SYSTEM_NAME}-session-admin`

  // Tracks the views (routes) that the user has navigated to within the application
  static readonly VISITED_VIEWS = `${SYSTEM_NAME}-visited-views-key`
  // Manages the views that are kept in memory for quick access and better performance.
  static readonly CACHED_VIEWS = `${SYSTEM_NAME}-cached-views-key`

  static readonly TOKEN = `${SYSTEM_NAME}-token-key`
}

export default CacheKey
