<template>
  <div>
    <v-dialog v-model="showStatePicker" max-width="500" overflow="hidden" persistent>
      <v-card width="auto" min-height="150px" title="Select a state to work in:">
        <template #actions>
          <v-container>
            <v-row class="d-flex" justify="space-evenly">
              <v-btn
                v-for="state in StateType"
                :key="state"
                variant="outlined"
                class="state-selector mx-1"
                :color="'white'"
                :style="{
                  backgroundColor: stateButtonColor(state),
                  borderColor: '#808080'
                }"
                @click="loadState(state)"
                >{{ state }}</v-btn
              >
            </v-row>
          </v-container>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped></style>
