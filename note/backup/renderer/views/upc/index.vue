<script setup lang="tsx">
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route: any = useRoute()

const handleRoute = (path: string): void => {
  router.push(basePath + path)
}

const basePath = '/upc/'

const routes = [
  { path: 'search', icon: 'mdi-card-search', label: 'Search' },
  { path: 'add/index', icon: 'mdi-plus-box', label: 'Add' },
  { path: 'edit/index', icon: 'mdi-pencil-box', label: 'Edit' }
]
</script>

<template>
  <v-container class="container rounded-lg" fluid>
    <v-container class="white-box rounded-lg justify-center">
      <v-card-title class="d-flex align-center justify-center line-one"
        >UPC Management</v-card-title
      >
      <v-card-title class="d-flex justify-center line-three">Select an Action</v-card-title>
      <v-row class="d-flex align-center justify-center">
        <v-btn
          v-for="(routeItem, index) in routes"
          :key="index"
          class="button rounded-xl"
          @click="handleRoute(routeItem.path)"
        >
          <v-col>
            <v-icon size="150" style="color: green">{{ routeItem.icon }}</v-icon>
            <v-card-text class="mt-4 title-card">{{ routeItem.label }}</v-card-text>
          </v-col>
        </v-btn>
      </v-row>
    </v-container>
  </v-container>
</template>

<style scoped>
@import './upcMgmt.css';
.v-btn__content {
  display: flex;
  flex-direction: column;
}
.line-one {
  padding-top: 2%;
  font-weight: 900;
  font-size: 225%;
  text-decoration: underline;
}
.line-three {
  font-style: italic;
  font-weight: 400;
  font-size: 150%;
}
.button {
  width: 25%;
  font-size: 110%;
  font-weight: 120%;
  min-height: 30vh;
  margin: 3%;
  background-color: rgba(175, 240, 150, 0.216);
  border: 2px solid #238a3a;
}
.white-box {
  margin-top: 5%;
  background-color: white;
  width: 60% !important;
  border: 2px solid #298a1b;
}
</style>
