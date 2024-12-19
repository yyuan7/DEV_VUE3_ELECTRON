<!-- TODO: replace fixed test avatar -->
<!-- TODO: consider to iterate a list for `operation area` than hard code -->

<template>
  <v-menu :close-on-content-click="false" location="bottom right" transition="slide-y-transition">
    <!-- ---------------------------------------------- -->
    <!-- Before Expansion: Headshot Btn -->
    <!-- ---------------------------------------------- -->
    <template #activator="{ props }">
      <v-btn class="mx-2" icon v-bind="props">
        <v-badge content="1" color="success" dot bordered>
          <v-avatar size="40">
            <avatar
              :name="userStore.username"
              style="width: 100%; height: 100%; object-fit: cover"
            ></avatar>
          </v-avatar>
        </v-badge>
      </v-btn>
    </template>

    <!-- ---------------------------------------------- -->
    <!-- After Expansion -->
    <!-- ---------------------------------------------- -->
    <v-card max-width="300">
      <v-list lines="three" density="compact">
        <!-- ---------------------------------------------- -->
        <!-- Name Area -->
        <!-- ---------------------------------------------- -->
        <v-list-item to="/profile">
          <template #prepend>
            <v-avatar size="40">
              <avatar
                :name="userStore.username"
                style="width: 100%; height: 100%; object-fit: cover"
              ></avatar>
            </v-avatar>
          </template>
          <v-list-item-title class="font-weight-bold text-primary">
            {{ userStore.username }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ userStore.roles }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <v-divider />

      <!-- ---------------------------------------------- -->
      <!-- Operation Area -->
      <!-- Profile Btn -->
      <!-- ---------------------------------------------- -->
      <v-list variant="flat" elevation="0" :lines="false" density="compact">
        <v-list-item color="primary" to="/profile" link density="compact">
          <template #prepend>
            <v-avatar size="30">
              <v-icon>mdi-account-box-outline</v-icon>
            </v-avatar>
          </template>

          <div>
            <v-list-item-subtitle class="text-body-2"> Profile Details </v-list-item-subtitle>
          </div>
        </v-list-item>
        <!-- ---------------------------------------------- -->
        <!-- Setting Btn -->
        <!-- ---------------------------------------------- -->
        <v-list-item color="primary" to="/setting" link density="compact">
          <template #prepend>
            <v-avatar size="30">
              <v-icon>mdi-cog</v-icon>
            </v-avatar>
          </template>

          <div>
            <v-list-item-subtitle class="text-body-2"> Setting </v-list-item-subtitle>
          </div>
        </v-list-item>
        <!-- ---------------------------------------------- -->
        <!-- Logout Btn -->
        <!-- ---------------------------------------------- -->
        <v-list-item color="primary" link density="compact" @click="handleLogout">
          <template #prepend>
            <v-avatar size="30">
              <v-icon>mdi-logout</v-icon>
            </v-avatar>
          </template>

          <div>
            <v-list-item-subtitle class="text-body-2"> Logout </v-list-item-subtitle>
          </div>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
// import StatusMenu from "./StatusMenu.vue";
import { useUserStore } from '@/renderer/store/modules/userStore'
import { useSnackbarStore } from '@/renderer/store/modules/snackbarStore'
import { useRouter } from 'vue-router'
import Avatar from 'vue3-avatar'

const router = useRouter()
const userStore = useUserStore()
const snackbarStore = useSnackbarStore()

const handleLogout = () => {
  userStore.logout()

  // Logout success
  router.push('/login')
  // snackbarStore.showSuccessMessage(`Good ${getTime()}, Welcome Back :)`)
  snackbarStore.showSuccessMessage('Logout Successfully')
}
</script>

<style scoped lang="scss">
// ::v-deep .v-list-item__append,
// ::v-deep .v-list-item__prepend {
//   height: 100%;
// }
</style>
