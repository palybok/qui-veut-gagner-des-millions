<template>
  <!-- logo centered -->
  <v-row no-gutters class="pa-10">

    <v-col cols="4" class="">
    </v-col>

    <v-col cols="4" class="pa-10 text-center" v-if="!public_screen.chrono">
      <v-img width="100%" src="logo.png" max-height="25dvh" />
    </v-col>
    
    <v-col cols="4" style="margin-left: 140px;" class="pa-10 text-center" v-if="public_screen.chrono">
      <chrono :time="public_screen.chrono_time" />
    </v-col>
    
    <v-col cols="4" class="pa-0 text-center" v-if="public_screen.form_stats_show && !public_screen.chrono">
      <v-card class="pa-0">
        <v-card-text class="text-center">
          <BarChart :chartData="publicVoteData" :height="250" :options="chartOptions" />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  
  <v-row no-gutters class="pa-0 question" v-if="q">
    <v-col cols="12">
      <v-row no-gutters class="pa-0">
        <v-col cols="12">
          <Question>{{ q }}</Question>
        </v-col>
        <v-col cols="6">
          <AnswerLeft :type="a.type" tag="A" :value="a.value" />
        </v-col>
        <v-col cols="6">
          <AnswerRight :type="b.type" tag="B" :value="b.value" />
        </v-col>
        <v-col cols="6">
          <AnswerLeft :type="c.type" tag="C" :value="c.value" />
        </v-col>
        <v-col cols="6">
          <AnswerRight :type="d.type" tag="D" :value="d.value" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>

  <v-navigation-drawer temporary width="400" app location="right" v-model="public_screen.pallier_show">
    <SideInfo />
  </v-navigation-drawer>

  <!-- Dialog pour le code QR -->
  <v-dialog v-model="public_screen.form_show_url" max-width="800px">
    <v-card theme="dark" class="pa-10">
      <v-card-title class="text-center" style="font-size: 3rem;">Scannez ce code</v-card-title>
      <v-card-text class="text-center">
        <vue-qrcode style="height: 400px;" :value="config.form_link"/>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Dialog pour les stats -->
  <v-dialog v-model="public_screen.form_stats_show_big" max-width="800px">
    <v-card class="pa-10">
      <v-card-title class="text-center" style="font-size: 3rem;">Réponse du public</v-card-title>
      <v-card-text class="text-center">
        <BarChart :chartData="publicVoteData" :height="700" :options="chartOptions" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import usePublic from '@/stores/public'
import useSounds from '@/stores/sounds'
import VueQrcode from 'vue-qrcode'
import useConfig from '@/stores/config'
import { BarChart, useBarChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const config = useConfig()
const public_screen = usePublic()
const sound = useSounds();
const audio = new Audio();
const audio_effect = new Audio();
audio.volume = 1.0;
audio_effect.volume = 1.0;

const play = computed(() => sound.play)
const play_effect = computed(() => sound.play_effect)
const loop = computed(() => sound.loop)
const loop_effect = computed(() => sound.loop_effect)

watch(loop, (newValue) => {
  audio.loop = newValue;
});

watch(play, (newValue) => {
  if (newValue) {
    audio.src = `${newValue}`;
    audio.play();
  } else {
    audio.pause();
    audio.currentTime = 0;
  }
});

watch(loop_effect, (newValue) => {
  audio_effect.loop = newValue;
});

watch(play_effect, (newValue) => {
  if (newValue) {
    audio_effect.src = `${newValue}`;
    audio_effect.play();
  } else {
    audio_effect.pause();
    audio_effect.currentTime = 0;
  }
});

const q = computed(() => public_screen.question)
const a = computed(() => public_screen.answers.a)
const b = computed(() => public_screen.answers.b)
const c = computed(() => public_screen.answers.c)
const d = computed(() => public_screen.answers.d)

const publicVoteData = ref({
  labels: ['A', 'B', 'C', 'D'],
  datasets: [{
    label: 'Votes Public (%)',
    data: [public_screen.form_stats.a, public_screen.form_stats.b, public_screen.form_stats.c, public_screen.form_stats.d],
    backgroundColor: [
      'rgba(255, 99, 132, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)'
    ]
  }]
});

watch(() => public_screen.form_stats, (newStats) => {
  publicVoteData.value.datasets[0].data = [newStats.a, newStats.b, newStats.c, newStats.d];
});

const chartOptions = {
  scales: {
    y: {
      beginAtZero: true,
      max: 100
    }
  }
};
</script>

<style>
html, body {
  overflow: hidden;
}

</style>

