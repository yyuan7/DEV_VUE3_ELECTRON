<script lang="ts" setup>
import { ref } from 'vue'
import { checkAdminPermission } from '@/renderer/utils/permission'

const menuVisible = ref(false)

const navs = [
  {
    title: 'Home Page',
    path: '/',
    icon: 'mdi-home'
  },
  {
    title: 'Manage UPC Info',
    path: '/upc',
    icon: 'mdi-barcode'
  },
  {
    title: 'Manage Billing Rules',
    path: '/billing',
    icon: 'mdi-currency-usd'
  },
  {
    title: 'Admin Action',
    path: '/admin',
    icon: 'mdi-lock'
  }
]

// Original Plan: render from permissionStore
// const noHiddenRoutes = computed(() => permissionStore.routes.filter((item) => !item.meta?.hidden))
</script>

<template>
  <v-menu v-model="menuVisible" offset-y>
    <template #activator="{ props }">
      <v-btn icon v-bind="props">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </template>

    <v-list variant="flat" elevation="0" :lines="false" density="compact">
      <template v-for="nav in navs" :key="nav.path">
        <v-list-item
          v-if="nav.title !== 'Admin Action' || checkAdminPermission()"
          :item="nav"
          color="primary"
          :to="nav.path"
          density="compact"
        >
          <template #prepend>
            <v-avatar size="30">
              <v-icon>{{ nav.icon }}</v-icon>
            </v-avatar>
          </template>

          <div>
            <v-list-item-title class="text-body-2">{{ nav.title }}</v-list-item-title>
          </div>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>
