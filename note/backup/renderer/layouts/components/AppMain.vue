<script lang="ts" setup>
import { useTagsViewStore } from '@/renderer/store/modules/tagStore'

const tagsViewStore = useTagsViewStore()
</script>

<template>
  <section class="app-main">
    <div class="app-scrollbar">
      <router-view v-slot="{ Component, route }">
        <transition name="el-fade-in" mode="out-in">
          <keep-alive :include="tagsViewStore.cachedViews">
            <component :is="Component" :key="route.path" class="app-container-grow" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </section>
</template>
