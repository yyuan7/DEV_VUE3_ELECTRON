import { onBeforeUnmount } from 'vue'
import mitt, { type Handler } from 'mitt'
import { type RouteLocationNormalized } from 'vue-router'

/** Type definition - callback */
type Callback = (route: RouteLocationNormalized) => void

const emitter = mitt()
const key = Symbol('ROUTE_CHANGE')
let latestRoute: RouteLocationNormalized

/** Emit an event for route change & Update with new route details */
export const setRouteChange = (to: RouteLocationNormalized) => {
  // Emit the ROUTE_CHANGE event
  emitter.emit(key, to)
  // Cache the latest route information
  latestRoute = to
}

/** Manage route change listeners with the publish-subscribe pattern for performance optimization */
export function useRouteListener() {
  /** An array of registered callback functions */
  const callbackList: Callback[] = []

  /** A listener for route changes () */
  const listenerRouteChange = (callback: Callback, immediate = false) => {
    // Store the callback
    callbackList.push(callback)
    // Register the callback to listen route-change events
    emitter.on(key, callback as Handler)
    // the callback can be executed immediately optionally
    immediate && latestRoute && callback(latestRoute)
  }

  /** Remove the route change listener */
  const removeRouteListener = (callback: Callback) => {
    emitter.off(key, callback as Handler)
  }

  /** Cleanup all listeners */
  onBeforeUnmount(() => {
    for (let i = 0; i < callbackList.length; i++) {
      removeRouteListener(callbackList[i])
    }
  })

  return { listenerRouteChange, removeRouteListener }
}
