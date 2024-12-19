<template>
  <v-app-bar app flat density="compact" color="transparent" :height="56" class="top-bar">
    <v-tabs :height="32" hide-slider center-active show-arrows class="mt-auto pl-2">
      <v-tab
        v-for="tag in tagsViewStore.visitedViews"
        :key="tag.path"
        :class="{ 'bg-primary': isActive(tag) }"
        class="tags-view-item"
        :to="{ path: tag.path, query: tag.query }"
      >
        {{ tag.meta?.title }}
        <v-btn
          v-if="!isAffix(tag)"
          size="small"
          density="compact"
          icon
          variant="text"
          @click.prevent.stop="closeSelectedTag(tag)"
        >
          <v-icon icon="mdi-close" size="small" />
        </v-btn>
      </v-tab>
    </v-tabs>
  </v-app-bar>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import path from 'path-browserify'
import {
  type RouteLocationNormalizedLoaded,
  type RouteRecordRaw,
  useRoute,
  useRouter
} from 'vue-router'
import { defaultSettings } from '@/renderer/config/layout'
import { type TagView, useTagsViewStore } from '@/renderer/store/modules/tagStore'
import { usePermissionStore } from '@/renderer/store/modules/PermissionRouteStore'
import { useRouteListener } from '@/renderer/hooks/useRouteListener'
import { VTab } from 'vuetify/lib/components/index.mjs'

const router = useRouter()
const route = useRoute()
const tagsViewStore = useTagsViewStore()
const permissionStore = usePermissionStore()
const { listenerRouteChange } = useRouteListener()

const tagRefs = ref<InstanceType<typeof VTab>[]>([])

let affixTags: TagView[] = []

/** Check for the currently active tag */
const isActive = (tag: TagView) => {
  return tag.path === route.path
}

/** Check for the fixed (unclosable) tag */
const isAffix = (tag: TagView) => {
  return tag.meta?.affix
}

/** Filter fixed (unclosable) tags */
const filterAffixTags = (routes: RouteRecordRaw[], basePath = '/') => {
  const tags: TagView[] = []
  routes.forEach((route) => {
    if (isAffix(route)) {
      const tagPath = path.resolve(basePath, route.path)
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta }
      })
    }
    if (route.children) {
      const childTags = filterAffixTags(route.children, route.path)
      tags.push(...childTags)
    }
  })
  return tags
}

/** Initialize tag views */
const initTags = () => {
  affixTags = filterAffixTags(permissionStore.routes)
  for (const tag of affixTags) {
    // Check for the name props before adding into the visited views
    tag.name && tagsViewStore.addVisitedView(tag)
  }
}

/** Add a tag view */
const addTags = (route: RouteLocationNormalizedLoaded) => {
  // Limit to 10 open tags
  if (tagsViewStore.visitedViews.length >= defaultSettings.maxTagsView + 1) return
  if (route.name) {
    tagsViewStore.addVisitedView(route)
    tagsViewStore.addCachedView(route)
  }
}

/** Navigate to the last visited tag view */
const toLastView = (visitedViews: TagView[], view: TagView) => {
  const latestView = visitedViews.slice(-1)[0]
  const fullPath = latestView?.fullPath
  if (fullPath !== undefined) {
    router.push(fullPath)
  } else {
    // Redirect to the home page if empty tag views
    if (view.name === 'home') {
      router.push({ path: '/redirect' + view.path, query: view.query })
    } else {
      router.push('/')
    }
  }
}

/** Close the currently selected tag view */
const closeSelectedTag = (view: TagView) => {
  tagsViewStore.delVisitedView(view)
  tagsViewStore.delCachedView(view)
  isActive(view) && toLastView(tagsViewStore.visitedViews, view)
}

/** Close all tag views */
const closeAllTags = (view: TagView) => {
  tagsViewStore.delAllVisitedViews()
  tagsViewStore.delAllCachedViews()
  if (affixTags.some((tag) => tag.path === route.path)) return
  toLastView(tagsViewStore.visitedViews, view)
}

/** Refresh the currently selected tag view */
const refreshSelectedTag = (view: TagView) => {
  tagsViewStore.delCachedView(view)
  router.replace({ path: '/redirect' + view.path, query: view.query })
}

onMounted(() => {
  initTags()
  // Listen for route changes -> add tag views
  listenerRouteChange(async (route) => {
    addTags(route)
  }, true)
  // Listen for route changes -> switch tag views
  listenerRouteChange(() => {
    nextTick()
  })
})
</script>

<style lang="scss" scoped></style>
