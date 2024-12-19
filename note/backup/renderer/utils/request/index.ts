import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { useUserStoreHook } from '@/renderer/store/modules/userStore'
import { getSessionData } from '@/renderer/utils/cache/sessionStorage'
import CacheKey from '@/renderer/constants/cacheKey'

/** Clear the user's session & redirect to the login page */
function logout() {
  // Log out
  useUserStoreHook().logout()
  // Page refresh
  location.reload()
}

/** Create an Axios instance for making HTTP requests */
function createService() {
  // Create an Axios instance
  const service = axios.create()

  // Request Interceptor
  service.interceptors.request.use(
    (config) => {
      // Retrieve token and bring it in the request header to the server
      const userStore = useUserStoreHook()
      if (userStore.token) {
        config.headers.token = userStore.token
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  // Response Interceptor
  service.interceptors.response.use(
    (response) => {
      return response.data
    },
    (error) => {
      console.log(error)
      const status = error.response.status
      switch (status) {
        case 400:
          error.message = 'Request Error'
          break
        case 401:
          // Unauthorized - likely token expired
          logout()
          break
        case 403:
          error.message = 'Access Denied'
          break
        case 404:
          error.message = 'Not Found'
          break
        case 408:
          error.message = 'Request Timeout'
          break
        case 500:
          error.message = 'Internal Server Error'
          break
        case 501:
          error.message = 'Not Implemented'
          break
        case 502:
          error.message = 'Bad Gateway'
          break
        case 503:
          error.message = 'Service Unavailable'
          break
        case 504:
          error.message = 'Gateway Timeout'
          break
        case 505:
          error.message = 'HTTP Version Not Supported'
          break
        default:
          break
      }
      alert(error.message)
      return Promise.reject(error)
    }
  )
  return service
}

/** A request function to make HTTP requests using the previously created Axios instance */
function createRequest(service: AxiosInstance) {
  return function <T>(config: AxiosRequestConfig): Promise<T> {
    const token = getSessionData(CacheKey.SESSION_DATA)?.token
    const defaultConfig = {
      headers: {
        // Attach the token if available
        Authorization: token ? `Bearer ${token}` : undefined,
        'Content-Type': 'application/json'
      },
      timeout: 5000,
      baseURL: import.meta.env.VITE_APP_BASE_API,
      data: {}
    }
    // Merge the default configuration with the user-defined configuration
    const mergeConfig = {
      ...defaultConfig,
      ...config
    }
    return service(mergeConfig)
  }
}

const service = createService()
export const request = createRequest(service)
