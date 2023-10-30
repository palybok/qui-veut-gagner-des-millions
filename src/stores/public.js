import { ref, onUnmounted  } from 'vue'
import { defineStore } from 'pinia'
import { io } from "socket.io-client";
import { useConfig } from '@/stores/config'

export const usePublic = defineStore('public', () => {

    // Config
    const config = useConfig()

    // Socket
    const socket = new io(config.socket);

    // Question
    const question = ref(null)

    // Answers
    const answers = ref({
      a: { value: null, type: null },
      b: { value: null, type: null },
      c: { value: null, type: null },
      d: { value: null, type: null }
    })

    // Jocker status
    const joker = ref({
      '50-50': true,
      'public': true,
      'phone': true
    })

    // Form show url
    const form_show_url = ref(false)

    // Form stats
    const form_stats = ref({})
    const form_stats_show = ref(false)
    const form_stats_show_big = ref(false)
    
    // Chrono
    const chrono = ref(false)
    const chrono_time = ref(30)

    // Amount
    const last_amount = ref(0)
    const amount = ref(0)
    const next_amount = ref(0)

    // Pallier
    const pallier_presentation = ref(false)
    const pallier_show = ref(false)

    // Joker present
    const joker_present = ref(false)

    socket.on('connect', () => {
      console.log("Connected to socket.io server.");
    });

    socket.on('data-updated', (data) => {
      if (data.type === 'UPDATE_QUESTION') {
        question.value = data.question;
        answers.value = data.answers;
        form_stats_show.value = false;
      }
      if(data.type === 'UPDATE_JOCKER'){
        joker.value = data.joker;
      }
      if(data.type === 'SHOW_FORM_URL'){
        form_show_url.value = true;
      }
      if(data.type === 'HIDE_FORM_URL'){
        form_show_url.value = false;
      }
      if(data.type === 'SHOW_FORM_STATS'){
        form_stats.value = data.stats;
        form_stats_show_big.value = true;
        setTimeout(() => {
          form_stats_show_big.value = false;
          form_stats_show.value = true;
        }, 5000)
      }
      if(data.type === 'START_CHRONO'){
        chrono.value = true;        
        chrono_time.value = data.time;
      }
      if(data.type === 'STOP_CHRONO'){
        chrono.value = false;        
      }
      if(data.type === 'WIN'){
        last_amount.value = data.last_amount;
        amount.value = data.amount;
        next_amount.value = data.next_amount;
      }
      if(data.type === 'LOSE'){
        last_amount.value = data.lost_amount;
        amount.value = data.amount;
      }
      if(data.type === 'PALLIER_PRESENTATION_ON'){
        pallier_presentation.value = true;
      }
      if(data.type === 'PALLIER_PRESENTATION_OFF'){
        pallier_presentation.value = false;
      }
      if(data.type === 'PALLIER_SHOW'){
        pallier_show.value = true;
      }
      if(data.type === 'PALLIER_HIDE'){
        pallier_show.value = false;
      }
      if(data.type === 'NEW_PARTY'){
        last_amount.value = 0;
        amount.value = 0;
        next_amount.value = 200;
        pallier_presentation.value = false;
        pallier_show.value = false;
      }
      if(data.type === 'JOKER_PRESENT'){
        joker_present.value = true;
        setTimeout(() => {
          joker_present.value = false;
        }, 10000)
      }
    });

    socket.on('disconnect', () => {
      console.log("Disconnected from socket.io server.");
      // reconnect
      socket.connect()
    });

    socket.on('error', (error) => {
      console.error("socket.io Error:", error);
    });

    // Properly disconnect from socket.io server when component unmounts
    onUnmounted(() => {
      socket.disconnect();
    });

    return { question, answers, joker, form_show_url, form_stats, form_stats_show, chrono, chrono_time, last_amount, amount, next_amount, pallier_presentation, pallier_show, form_stats_show_big, joker_present }
})

export default usePublic;
