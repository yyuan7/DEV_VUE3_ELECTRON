import { useTagsViewStore } from '@/renderer/store/modules/tagStore'

/** Close the currently selected tag view */
export const closeCurrentTag = (router, route) => {
  const tagsViewStore = useTagsViewStore()

  for (const tag of tagsViewStore.visitedViews) {
    if (tag?.path === route.path) {
      // 1. remove
      tagsViewStore.delVisitedView(tag)
      tagsViewStore.delCachedView(tag)
      // 2. Navigate to the last active view
      const latestView = tagsViewStore.visitedViews.slice(-1)[0]
      const fullPath = latestView?.fullPath
      if (fullPath !== undefined) {
        router.push(fullPath)
      } else {
        router.push('/')
      }
    }
  }
}
