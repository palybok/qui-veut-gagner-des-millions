<script setup>
  import { useTuya } from '@/stores/tuya'
  const tuya = useTuya()
  tuya.init()
  setTimeout(() => {
    tuya.init()
  }, 180000)
</script>

<template>
  <v-app class="app">
      <notifications position="bottom right" />
      <router-view />
  </v-app>

</template>

<style>
html {
  overflow: hidden;
}

.app{
  background-image: url("background.jpg") !important;
  background-repeat: no-repeat;
  background-size: cover !important;
  background-position: center center;
  height: 100dvh !important;
  width: 100dvw !important;
}


</style>