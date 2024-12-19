<script setup lang="ts">
import { useUserStore } from '@/renderer/store/modules/userStore'
import { backgroundColor } from '@/renderer/utils/stateColorGetter'

const userStore = useUserStore()

const navs = [
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

const workList = [
  {
    title: 'Unknown UPCs',
    path: '/unknown'
  },
  {
    title: 'Known Unpaid UPCs',
    path: '/unpaid'
  },
  {
    title: 'To Do List',
    path: '/todo'
  }
]
</script>

<template>
  <v-container
    class="ma-2 container rounded-lg"
    fluid
    :style="{ backgroundColor: backgroundColor('Maine') }"
  >
    <v-row no-gutters align="center" class="text-center">
      <v-col cols="12" md="6">
        <v-card class="justify-center mx-auto button-container">
          <v-card-title class="home-header"
            >Welcome,
            {{ userStore.username.substring(0, userStore.username.indexOf('@')) }}</v-card-title
          >
          <v-card-subtitle class="home-subheader">What would you like to do today?</v-card-subtitle>

          <v-card-text class="mb-10">
            <template v-for="nav in navs" :key="nav.path">
              <v-row>
                <v-col>
                  <v-btn :to="nav.path" class="main-action-btn justify-start">
                    <v-icon class="pl-4 pr-6" size="250%">{{ nav.icon }}</v-icon>
                    <v-card-text class="btn-text">{{ nav.title }}</v-card-text>
                  </v-btn>
                </v-col>
              </v-row>
            </template>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="justify-center mx-auto button-container">
          <v-card-title class="home-second-header">Work In List</v-card-title>
          <v-card-text>
            <template v-for="work in workList" :key="work.path">
              <v-row>
                <v-col>
                  <v-btn :to="work.path" class="list-action-btn">
                    <v-card-text class="btn-text">{{ work.title }}</v-card-text>
                  </v-btn>
                </v-col>
              </v-row>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
@import '@/renderer/styles/lowAdmin.css';
@import '@/renderer/styles/billing.css';
.home-header {
  font-size: 250%;
  font-weight: bold;
}
.home-second-header {
  font-size: 200%;
  font-weight: bold;
}
.home-subheader {
  font-size: 140%;
  font-style: italic;
}
.button-container {
  max-width: 43vw;
  min-height: 50vh;
}
.main-action-btn {
  background-color: #ecf1f8;
  min-height: 9vh;
  width: 30vw;
  margin-top: 5%;
  text-align: start;
}
.list-action-btn {
  background-color: #ecf1f8;
  min-height: 8vh;
  width: 23vw;
  margin-top: 5%;
  text-align: start;
}
.btn-text {
  font-size: 170%;
}
</style>
