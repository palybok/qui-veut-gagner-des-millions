import { ref, onUnmounted } from 'vue'
import { defineStore } from 'pinia'
import { useSockets } from '@/stores/sockets'
import { useQuestions } from '@/stores/questions'
import { io } from "socket.io-client";
import { useConfig } from '@/stores/config'
import { useSounds } from '@/stores/sounds'

export const useJokers = defineStore('jokers', () => {

    // Config
    const config = useConfig()
  
    // Sockets
    const ws = useSockets()

    // Socket
    const socket = new io(config.socket);

    // Sounds
    const sounds = useSounds()

    socket.on('connect', () => {
      console.log("Connected to socket.io server.");
    });

    socket.on('data-updated', (data) => {
      if (data.type === 'SUBMIT_FORM') {
        // Ajout de cette IP à answered_ips si elle n'y est pas déjà
        if (!public_ips.value.includes(data.ip)) {
          public_ips.value.push(data.ip);
          public_answers.value.push(data.tag);
        }

        update_stats();
      }
    });

    socket.on('disconnect', () => {
      console.log("Disconnected from socket.io server.");
    });

    socket.on('error', (error) => {
      console.error("socket.io Error:", error);
    });

    // Questions
    const questions = useQuestions()

    // Forms answers
    const public_answers = ref([])
    const public_ips = ref([]);
    const public_stats = ref({
      a: 0,
      b: 0,
      c: 0,
      d: 0
    });


    // Jocker status
    const joker = ref({
      '50-50': true,
      'public': true,
      'phone': true
    })

    function reset(){
      joker.value = {
        '50-50': true,
        'public': true,
        'phone': true
      }
      ws.joker(joker.value);
      public_answers.value = [];
      public_ips.value = [];
      public_stats.value = {
        a: 0,
        b: 0,
        c: 0,
        d: 0
      };
      return true
    }
    
    function use(item){
      if(questions.question === null){
        throw new Error('No question, start a new party or next question');
      }

      if(item !== '50-50' && item !== 'public' && item !== 'phone'){
        throw new Error('Invalid joker, must be 50-50, public or phone');
      }

      if(joker.value[item] === false){
        throw new Error('Joker already used');
      }
      

      if(item === '50-50'){
        joker_50_50()
      }

      if(item === 'public'){
        joker_public()
      }

      if(item === 'phone'){
        joker_phone()
      }

      joker.value[item] = false;
      ws.joker(joker.value);

      return true;
    }

    function joker_50_50() {
      // Identifier les réponses incorrectes
      let bad_answers = Object.keys(questions.answers).filter(key => questions.answers[key].type === 'bad');

      // Mélanger et prendre les deux premiers
      questions.shuffle(bad_answers);
      bad_answers = bad_answers.slice(0, 2);

      // Réinitialiser ces réponses
      bad_answers.forEach(key => {
        questions.answers[key].value = null;
      });

      ws.question(questions.question, questions.answers);
    }

    function joker_phone() {
      // const last_song_name = sounds.play.slice(0, -4);
      ws.sound("joker_phone", false);
      setTimeout(() => {
        ws.start_chrono(30);
        setTimeout(() => {
          ws.stop_chrono();
          ws.sound("present_palliers", false);
        }, 30000);
      }, 12600);

    }

    function joker_public() {
      // const last_song_name = sounds.play.slice(0, -4);
      // On affiche l'url
      ws.sound("joker_public", false);
      setTimeout(() => {
        ws.form_show_url();
      }, 500);

      // Attendre une minute pour que tout le monde scanne
      setTimeout(() => {

        ws.form_hide_url();
        ws.start_chrono(16);
        ws.form_open();

        // Créez un interval pour appeler ws.form_open toutes les secondes
        let intervalId = setInterval(() => {
          ws.form_open();
          // on envoie la liste des ips qui ont déjà répondu
          ws.form_ips(public_ips.value);
        }, 500);

        // Commencez le décompte de 30 secondes
        setTimeout(() => {
          // Arrêtez l'intervalle pour ne plus appeler ws.form_open
          clearInterval(intervalId);

          // Afficher les statistiques basées sur publicAnswers
          ws.form_show_stats(public_stats.value)

          // Fermer le formulaire et arrêter le décompte
          ws.form_close();
          ws.stop_chrono();
          
          ws.sound("present_palliers", true);

        }, 16 * 1000);
      }, 17 * 1000);
    }
        
    function update_stats() {
      
      const counter = {
          a: 0,
          b: 0,
          c: 0,
          d: 0
      };

      const result = {
          a: 0,
          b: 0,
          c: 0,
          d: 0
      };

      // Comptez les occurrences de chaque réponse
      for (let answer of public_answers.value) {
          if (counter.hasOwnProperty(answer)) {
              counter[answer]++;
          }
      }

      // Calculez le total des réponses
      let totalAnswers = public_answers.value.length;

      // Convertissez les compteurs en pourcentages
      for (let key in counter) {
          let count = counter[key];
          result[key] = (count / totalAnswers) * 100; 
      }

      public_stats.value = result;
      return true;
    }

    return { 
        joker,
        reset,
        use,
        public_answers,
        public_ips,
        public_stats
    }
})
export default useJokers;
