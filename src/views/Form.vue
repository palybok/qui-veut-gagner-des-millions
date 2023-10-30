<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6" v-if="have_form && status === 'waiting'">
        <v-card theme="dark">
          <v-card-title class="text-center">
              Avis du Public
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col v-for="option in options" :key="option" cols="6">
                <v-btn style="height: 150px;" block large :outlined="selectedOption !== option" :color="selectedOption === option ? 'success' : 'error'"
                  @click="selectedOption = option">
                  {{ option }}
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="text-center">
                <v-btn :disabled="!selectedOption" color="success" @click="submitVote">
                  Soumettre
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" v-if="have_form && status === 'sent'">
        <v-card theme="dark">
          <v-card-title class="text-center">
          </v-card-title>
          <v-card-text>
              <h1>Merci !</h1>
              <br><br>
              <p>
                Votre avis a bien été pris en compte. Merci d'avoir participé !<br><br> En attendant que le formulaire soit fermé, vous pouvez continuer à regarder le jeu.
              </p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" v-if="!have_form">
        <v-card theme="dark">
          <v-card-title class="text-center">
              Avis du Public
          </v-card-title>
          <v-card-text>
            <p>
              Aucun formulaire n'est disponible pour le moment.
              Restez sur cette page, un formulaire apparaitra dès que le joueur en aura besoin.
            </p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" class="pa-10">
        <v-img width="100%" src="logo.png" max-height="25dvh" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import useForms from '@/stores/forms';

const forms = useForms();
const options = ['A', 'B', 'C', 'D'];
const selectedOption = ref('');
const submited = ref(false);
const have_form = computed(() => forms.form);
const status = computed(() => forms.status);
const myIP = ref('')

function submitVote() {
  if (selectedOption.value) {
    forms.submit(selectedOption.value.toLowerCase());
    submited.value = true;
  }
}

</script>