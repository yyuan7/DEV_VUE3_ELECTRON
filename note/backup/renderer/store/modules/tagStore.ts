import { ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import { defaultSettings } from '@/renderer/config/layout'
import { type RouteLocationNormalized } from 'vue-router'
import {
  getVisitedViews,
  setVisitedViews,
  getCachedViews,
  setCachedViews
} from '@/renderer/utils/cache/localStorage'

/**
 * Have some or all of the properties of RouteLocationNormalized
 * Flexible in creating tag views that may not require all properties of a full route object
 * https://router.vuejs.org/api/interfaces/RouteLocationNormalizedTyped.html
 */
export type TagView = Partial<RouteLocationNormalized>

export const useTagsViewStore = defineStore('tags-view', () => {
  const { cacheTagsView } = defaultSettings
  const visitedViews = ref<TagView[]>(cacheTagsView ? getVisitedViews() : [])
  const cachedViews = ref<string[]>(cacheTagsView ? getCachedViews() : [])

  /** Sync the local storage with the current state of visited and cached views */
  watchEffect(() => {
    setVisitedViews(visitedViews.value)
    setCachedViews(cachedViews.value)
  })

  /** Add a visited tag view to the state without duplicates */
  const addVisitedView = (view: TagView) => {
    // Check for existing view to avoid duplicates
    const index = visitedViews.value.findIndex((v) => v.path === view.path)

    if (index !== -1) {
      // Update existing view if different query (fullPath)
      visitedViews.value[index].fullPath !== view.fullPath &&
        (visitedViews.value[index] = { ...view })
    } else {
      // Add the new view to the visited views
      visitedViews.value.push({ ...view })
    }
  }

  /** Add a view to the cached views if it has a valid name and is not cached yet */
  const addCachedView = (view: TagView) => {
    if (typeof view.name !== 'string') return
    if (cachedViews.value.includes(view.name)) return
    if (view.meta?.keepAlive) cachedViews.value.push(view.name)
  }

  /** Delete a visited view */
  const delVisitedView = (view: TagView) => {
    const index = visitedViews.value.findIndex((v) => v.path === view.path)
    if (index !== -1) {
      visitedViews.value.splice(index, 1)
    }
  }

  /** Delete a cached view */
  const delCachedView = (view: TagView) => {
    if (typeof view.name !== 'string') return
    const index = cachedViews.value.indexOf(view.name)
    if (index !== -1) cachedViews.value.splice(index, 1)
  }

  /** Delete all visited view other than the chosen one and fixed views */
  const delOthersVisitedViews = (view: TagView) => {
    visitedViews.value = visitedViews.value.filter((v) => {
      return v.meta?.affix || v.path === view.path
    })
  }

  /** Delete all cached view other than the chosen one */
  const delOthersCachedViews = (view: TagView) => {
    if (typeof view.name !== 'string') return
    const index = cachedViews.value.indexOf(view.name)
    if (index !== -1) {
      cachedViews.value = cachedViews.value.slice(index, index + 1)
    } else {
      // Clear all cache if the specified view is not found
      cachedViews.value = []
    }
  }

  /** Delete all visited views */
  const delAllVisitedViews = () => {
    // Retain affixed tags only
    visitedViews.value = visitedViews.value.filter((tag) => tag.meta?.affix)
  }

  /** Delete all cached views */
  const delAllCachedViews = () => {
    cachedViews.value = []
  }

  return {
    visitedViews,
    cachedViews,
    addVisitedView,
    addCachedView,
    delVisitedView,
    delCachedView,
    delOthersVisitedViews,
    delOthersCachedViews,
    delAllVisitedViews,
    delAllCachedViews
  }
})
