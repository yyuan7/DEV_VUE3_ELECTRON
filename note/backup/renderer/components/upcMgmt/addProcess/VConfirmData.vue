<script setup lang="ts">
const props = defineProps({
  upc: { type: String },
  data: { type: Object }
})
</script>

<template>
  <v-container class="stepper-field rounded-lg text-xs-center">
    <v-card-title class="justify-center position-relative upc-title"
      >UPC Code: {{ upc }}</v-card-title
    >
    <v-row class="justify-start position-relative">
      <v-card-title class="text-field">Product Name:</v-card-title>
      <v-text-field
        :bg-color="'white'"
        class="text-field"
        density="compact"
        disabled
        variant="outlined"
        >{{ data.finalName.value }}</v-text-field
      >
      <v-card-title class="text-field">Manufacturer:</v-card-title>
      <v-text-field
        :bg-color="'white'"
        class="text-field"
        density="compact"
        disabled
        variant="outlined"
        >{{ data.finalManu.value }}</v-text-field
      >
    </v-row>
    <v-row class="justify-start position-relative">
      <v-card-title class="text-field">Product Type:</v-card-title>
      <v-text-field
        :bg-color="'white'"
        class="text-field"
        density="compact"
        disabled
        variant="outlined"
        >{{ data.finalType.value }}</v-text-field
      >

      <v-card-title class="text-field">Material:</v-card-title>
      <v-text-field
        :bg-color="'white'"
        class="text-field"
        density="compact"
        disabled
        variant="outlined"
        >{{ data.finalMaterial.value }}</v-text-field
      >
    </v-row>
    <v-row class="justify-start position-relative">
      <v-card-title class="text-field">Volume:</v-card-title>
      <v-text-field
        :bg-color="'white'"
        class="text-field mass-format"
        density="compact"
        disabled
        variant="outlined"
        >{{ data.finalVolume.value }}</v-text-field
      >
      <v-card-title class="text-field">Units:</v-card-title>
      <v-text-field
        :bg-color="'white'"
        class="text-field mass-format"
        density="compact"
        disabled
        variant="outlined"
        >oz.</v-text-field
      >
      <v-card-title class="text-field"> Weight (lbs):</v-card-title>
      <v-text-field
        :bg-color="'white'"
        class="text-field mass-format"
        density="compact"
        disabled
        variant="outlined"
        >{{ data.finalWeight.value }}</v-text-field
      >
    </v-row>
    <v-row class="justify-start position-relative">
      <v-card-title class="text-field me-4">Note:</v-card-title>
      <v-textarea
        :bg-color="'white'"
        class="me-6 note-field"
        density="compact"
        disabled
        no-resize
        :placeholder="data.note.value"
        rows="2"
        variant="outlined"
        >{{ data.note.value }}</v-textarea
      >
    </v-row>
  </v-container>
</template>

<style scoped>
.stepper-field {
  background-color: rgb(235, 235, 235);
}
.text-field {
  padding: 1%;
  max-width: 500px;
}
.mass-format {
  min-width: 0px;
  max-width: 300px;
  width: 50px;
}
.upc-title {
  text-decoration: underline;
  font-weight: 900;
  font-size: 150%;
  text-align: center;
  margin-bottom: 2%;
}
.note-field {
  max-width: 700px;
}
</style>
