<template>
  <div class="container">    
    <v-row class="pa-5">
      <v-col cols="9">
          <v-row no-gutters class="pa-0">
              <v-col cols="12">
                  <Question>{{ q }}</Question>
              </v-col>
              <v-col cols="6">
                    <AnswerLeft :type="a.type" tag="A" @click="() => select_answer('a')" :value="a.value"/>
              </v-col>
              <v-col cols="6">
                  <AnswerRight :type="b.type" tag="B" @click="() => select_answer('b')" :value="b.value"/>
              </v-col>
              <v-col cols="6">
                  <AnswerLeft :type="c.type" tag="C" @click="() => select_answer('c')" :value="c.value"/>
              </v-col>
              <v-col cols="6">
                  <AnswerRight :type="d.type" tag="D" @click="() => select_answer('d')" :value="d.value"/>
              </v-col>
          </v-row>
      </v-col>    
      <v-col cols="3">
        <v-row>       
          <v-col cols="3">
            <Jocker5050 class="ma-5" :joker="j_50_50" @click="() => controller.use_joker('50-50')"/>
            <JockerPublic class="ma-5" :joker="j_public" @click="() => controller.use_joker('public')"/>
            <JockerPhone class="ma-5" :joker="j_phone" @click="() => controller.use_joker('phone')"/>
          </v-col>
            <v-col cols="6">
              <h3 class="ma-5">Pallier: {{ pallier }}</h3>
              <h3 class="ma-5">En poche: {{ amount }} €</h3>
              <h3 class="ma-5">Question à: {{ next_amount }} €</h3>
            </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-row>        

          <v-col cols="3">
            <h1>Contrôle de base</h1>
            <hr>
            <v-btn class="mt-5" color="error" @click="controller.start()">Commencer une session</v-btn>
                  <br>
              <v-btn class="mt-5" color="error" @click="controller.abandon()">Abandon de la partie</v-btn>
                <br>
            <v-btn class="mt-5" color="" @click="controller.reset()">Nouvelle partie</v-btn>
              <br>

            <h1 class="mt-10">Contrôle des lumières</h1>
            <hr>
            <v-btn class="mt-5" color="success" @click="device_on">Allumer</v-btn>
            <br>
            <v-btn class="mt-5" color="error" @click="device_off">Eteindre</v-btn>
          </v-col>


          <v-col cols="2">
            <h1>Intro</h1>
            <hr>
            <v-btn class="mt-5" color="" @click="controller.welcome_guests()">Accueil des invités</v-btn>
            <br>
            <v-btn class="mt-5" color="" @click="controller.present_palliers()">Présentation des palliers</v-btn>
            <br>
            <v-btn class="mt-5" color="" @click="controller.present_jokers()">Présentation des jokers</v-btn>
            
            <h1 class="mt-10">Outro</h1>
            <hr>
              <v-btn class="mt-5" color="" @click="controller.goodbye_guests()">Sortie des invités</v-btn>
          </v-col>

          <v-col cols="2">
            <h1>Contrôle du jeu</h1>
            <hr>
            <v-btn class="mt-5" color="primary" @click="controller.next_question()">Nouvelle question</v-btn>
            <br>
            <v-btn class="mt-5" color="success" @click="controller.reveal_answer()">Réponse</v-btn>
            <br>
              <h1 class="mt-10">Contrôle Publicité</h1>
            <hr>
            <v-btn class="mt-5" color="success" @click="controller.start_pub()">Pub</v-btn>
            <br>
            <v-btn class="mt-5" color="success" @click="controller.stop_pub()">Fin de pub</v-btn>
          </v-col>

          <v-col cols="2">
            <h1>Vote du public</h1>
            <hr>
            <BarChart :chartData="publicVoteData" :options="chartOptions" />
          </v-col>
          
          <!-- <v-col cols="3" class="pa-10 text-center" > -->
          <v-col cols="3" class="pa-10 text-center" v-if="controller.chrono">
            <chrono :time="controller.chrono_time" />
            <!-- <chrono :time="15" /> -->
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>

import { ref, computed, watch } from 'vue'
import useController from '@/stores/controller'
import useTuya from '@/stores/tuya'
import useQuestions from '@/stores/questions'
import useJokers from '@/stores/jokers'
import usePalliers from '@/stores/palliers'
import { BarChart, useBarChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);


const controller = useController()
const tuya = useTuya()
const questions = useQuestions()
const jokers = useJokers()
const palliers = usePalliers()

const next_amount = computed(() => palliers.next_amount())
const pallier = computed(() => palliers.pallier)
const amount = computed(() => palliers.amount)


const q = computed(() => questions.question)
const a = computed(() => questions.answers.a)
const b = computed(() => questions.answers.b)
const c = computed(() => questions.answers.c)
const d = computed(() => questions.answers.d)
const j_50_50 = computed(() => jokers.joker['50-50'])
const j_public = computed(() => jokers.joker['public'])
const j_phone = computed(() => jokers.joker['phone'])

function select_answer(tag) {
  controller.select_answer(tag)
}

async function device_on() {
  tuya.device_turn_on("bf4d8141e42adf51c2ew9d")
}

async function device_off() {
  tuya.device_turn_off("bf4d8141e42adf51c2ew9d")
} 

const publicVoteData = ref({
  labels: ['A', 'B', 'C', 'D'],
  datasets: [{
    label: 'Votes Public (%)',
    data: [jokers.public_stats.a, jokers.public_stats.b, jokers.public_stats.c, jokers.public_stats.d],
    backgroundColor: [
      'rgba(255, 99, 132, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)'
    ]
  }]
});
 
watch(() => jokers.public_stats, (newStats) => {
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

<style scoped>
.container {
  background: black;
  height: 100dvh;
  width: 100%;
  border-radius: 15px;
  color: white;
}


</style>