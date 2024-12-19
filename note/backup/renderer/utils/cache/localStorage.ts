/** Manage localStorage: tagViews */

import CacheKey from '@/renderer/constants/cacheKey'
import { type TagView } from '@/renderer/store/modules/tagStore'

/** Retrieves the list of visited views from localStorage */
export const getVisitedViews = () => {
  const json = localStorage.getItem(CacheKey.VISITED_VIEWS)
  return JSON.parse(json ?? '[]') as TagView[]
}

/** Set the provided array of visited views in localStorage */
export const setVisitedViews = (views: TagView[]) => {
  views.forEach((view) => {
    // Remove props to avoid potential circular references caused by `JSON.stringify` during serialization
    delete view.matched
    delete view.redirectedFrom
  })
  localStorage.setItem(CacheKey.VISITED_VIEWS, JSON.stringify(views))
}

/** Retrieves the list of cached views from localStorage */
export const getCachedViews = () => {
  const json = localStorage.getItem(CacheKey.CACHED_VIEWS)
  return JSON.parse(json ?? '[]') as string[]
}

/** Set the provided array of cached views in localStorage */
export const setCachedViews = (views: string[]) => {
  localStorage.setItem(CacheKey.CACHED_VIEWS, JSON.stringify(views))
}
