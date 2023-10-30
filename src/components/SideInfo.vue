<template>
  <div class="slide-container">
    <v-row no-gutters class="pt-15">
        <v-col cols="4" class="text-center">
          <Jocker5050 :joker="j_50_50" :class="{ 'zoom-effect': zoomJoker5050 }"/>
        </v-col>

        <v-col cols="4" class="text-center">
          <JockerPublic :joker="j_public" :class="{ 'zoom-effect': zoomJokerPublic }"/>
        </v-col>

        <v-col cols="4" class="text-center">
          <JockerPhone :joker="j_phone" :class="{ 'zoom-effect': zoomJokerPhone }"/>
        </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-center">
        <pallier :from_amount="fa" :to_amount="a" :presentation="pp" />
      </v-col>
    </v-row>
  </div>  
</template>

<script setup>

import { ref, computed, watch } from 'vue'
import usePublic from '@/stores/public'

const public_screen = usePublic()

const j_50_50 = computed(() => public_screen.joker['50-50'])
const j_public = computed(() => public_screen.joker['public'])
const j_phone = computed(() => public_screen.joker['phone'])
const fa = computed(() => public_screen.from_amount)
const a = computed(() => public_screen.amount)
const pp = computed(() => public_screen.pallier_presentation)

const zoomJoker5050 = ref(false)
const zoomJokerPublic = ref(false)
const zoomJokerPhone = ref(false)

watch(() => public_screen.joker_present, (state) => {
  if (state) {
    setTimeout(() => {
      zoomJoker5050.value = true
    }, 1200);
    setTimeout(() => {
      zoomJoker5050.value = false
      zoomJokerPublic.value = true
    }, 2300);
    setTimeout(() => {
      zoomJokerPublic.value = false
      zoomJokerPhone.value = true
    }, 3500); 
    setTimeout(() => {
      zoomJokerPhone.value = false
    }, 4800); 
  }
  else {
    zoomJoker5050.value = false
    zoomJokerPublic.value = false
    zoomJokerPhone.value = false
  }
});

</script>

<style scoped>
  .slide-container {
    height: 100dvh;
    width: 100%;
    background: linear-gradient(-45deg, rgb(9, 9, 120), black, rgb(20, 20, 152)); 
    color: #fff;
  }
  
  .zoom-effect {
    transform: scale(1.5);
    transition: transform 0.5s ease;
  }
</style>


