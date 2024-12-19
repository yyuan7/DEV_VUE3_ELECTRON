import {
  type Router,
  type RouteRecordNormalized,
  type RouteRecordRaw,
  createRouter,
  createWebHashHistory
} from 'vue-router'
import { cloneDeep } from 'lodash-es'

export const history = createWebHashHistory()

/** Flatten multi-level routes into a two-level structure  */
export const flatMultiLevelRoutes = (routes: RouteRecordRaw[]) => {
  // const routesMirror = JSON.parse(JSON.stringify(routes));
  const routesMirror = cloneDeep(routes)
  routesMirror.forEach((route) => {
    isMultipleRoute(route) && promoteRouteLevel(route)
  })
  return routesMirror
}

/** Checks for hierarchy levels */
const isMultipleRoute = (route: RouteRecordRaw) => {
  const children = route.children
  if (children?.length) {
    // multi-level if any child has grand-children
    return children.some((child) => child.children?.length)
  }
  return false
}

/** Promote the two-level structure by removing nested children */
const promoteRouteLevel = (route: RouteRecordRaw) => {
  // Check if the route has children
  if (!route.children || route.children.length === 0) {
    return
  }

  // Create a router instance to access and parse information
  let router: Router | null = createRouter({
    history,
    routes: [route]
  })
  const routes = router.getRoutes()

  // Update the children of the route
  addToChildren(routes, route.children || [], route)
  router = null

  // Remove all children from the child routes after promoting to two levels
  route.children = route.children?.map((item) => {
    // Destructure to exclude 'children'
    const { children, ...rest } = item
    return rest as RouteRecordRaw
  })
}

/** Adds children routes */
const addToChildren = (
  routes: RouteRecordNormalized[],
  children: RouteRecordRaw[],
  routeModule: RouteRecordRaw
) => {
  children.forEach((child) => {
    const route = routes.find((item) => item.name === child.name)
    if (route) {
      // Initialize chilren
      routeModule.children = routeModule.children || []

      // Add the route to the children if not included
      if (!routeModule.children.includes(route)) {
        routeModule.children.push(route)
      }

      // Recursively add grand-children
      if (child.children?.length) {
        addToChildren(routes, child.children, routeModule)
      }
    }
  })
}
