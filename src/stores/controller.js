import { ref, onUnmounted  } from 'vue'
import { defineStore } from 'pinia'
import { useNotifyService } from '@/stores/notify'
import { useLights } from '@/stores/lights'
import { useQuestions } from '@/stores/questions'
import { useSockets } from '@/stores/sockets'
import { useJokers } from '@/stores/jokers'
import { usePalliers } from '@/stores/palliers'
import { io } from "socket.io-client";
import { useConfig } from '@/stores/config'

export const useController = defineStore('controller', () => {

    // Config
    const config = useConfig()

    // Socket
    const socket = new io(config.socket);

    // Notify
    const notify = useNotifyService()

    // Lights
    const light = useLights()

    // Questions
    const questions = useQuestions()

    // Jokers
    const jokers = useJokers()

    // Palliers
    const palliers = usePalliers()

    // Next Amount
    const next_amount = ref(200)

    // Sockets
    const ws = useSockets()

    // Chrono
    const chrono = ref(false)
    const chrono_time = ref(30)
    
    socket.on('connect', () => {
      console.log("Connected to socket.io server.");
    });

    socket.on('data-updated', (data) => {
      if(data.type === 'START_CHRONO'){
        chrono.value = true;        
        chrono_time.value = data.time;
      }
      if(data.type === 'STOP_CHRONO'){
        chrono.value = false;        
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

    function reset(){
      ws.stop_chrono()
      questions.reset()
      jokers.reset()      
      light.start()
      palliers.reset()
      next_amount.value = 200
      ws.new_party()
      ws.pallier_present(false)
      ws.pallier_show(false)
      ws.sound('null', false);
      return true
    }

    function start(){
      reset()
      ws.sound('generique', false);
      return true
    }

    function welcome_guests(){
      ws.sound('welcome_guests', false);
      return true
    }

    function goodbye_guests(){
      ws.sound('goodbye_guests', false);
      return true
    }

    function present_palliers(){
      ws.pallier_present(true)
      ws.sound('present_palliers', false);
      return true
    }

    function present_jokers(){
      ws.joker_present()
      ws.sound_effect('present_jokers', false);
      return true
    }

    function start_pub(){
      ws.sound('start_pub', false);
      return true
    }

    function stop_pub(){
      ws.sound('stop_pub', false);
      return true
    }

    function next_question(){      

      ws.pallier_present(false)
      ws.pallier_show(false)

      // Get the next question
      try{
        questions.grap(next_amount.value)
      } catch (e) {
        notify.set_error(e.message);
        return false
      }

      // Change the light
      light.new_question()

      // Sound
      ws.sound("question_" + next_amount.value, true)

      return true;
    }


    function reveal_answer(){
      
      // Reveal the answer
      try{        
        setTimeout(() => {
          questions.reveal()
        }, 1000);
      } catch (e) {
        notify.set_error(e.message);
        return false
      }

      ws.pallier_show(true)        
      setTimeout(() => {
        ws.pallier_show(false)
      }, 4000);

      // Change the light
      if(questions.selected !== questions.correct){        
        lose()
      } else {
        win()
      }

      return true;
    }

    function win(){
      light.win()
      const last_amount = palliers.amount
      palliers.win()
      ws.sound("win_" + palliers.amount, false)
      next_amount.value = palliers.next_amount()
      ws.win(last_amount, palliers.amount, next_amount.value)

      // a fixer
      // if(palliers.pallier === 1 || palliers.pallier === 2 || palliers.pallier === 3 || palliers.pallier === 4){
      //   light.new_pallier()
      // }
    }

    function lose(){
      light.lose()
      ws.sound("lose_" + palliers.next_amount(), false)
      const lost_amount = palliers.amount
      palliers.lose()
      ws.lose(lost_amount, palliers.amount)
    }

    function select_answer(tag){

      if(palliers.next_amount() >= 3000){      
        ws.sound("select_" + palliers.next_amount())  
      }
      
      // select the answer
      setTimeout(() => {
        try{
          questions.select(tag)
        } catch (e) {
          notify.set_error(e.message);
          return false
        }
      }, 1000);
    
      
      // Change the light
      light.selected()

      return true;
    }

    function use_joker(joker){

      // use the joker
      try{
        jokers.use(joker)
      } catch (e) {
        notify.set_error(e.message);
        return false
      }

      if(joker === "50-50"){
        ws.sound_effect("joker_50_50", false);
      }
      
      return true;

    }

    function abandon(){
      questions.abandon()
      ws.sound("lose_" + palliers.next_amount(), false)
      return true;
    }

    return { 
      start,
      reset, 
      abandon,
      next_question, 
      reveal_answer, 
      select_answer, 
      welcome_guests,
      goodbye_guests,
      use_joker,
      present_palliers,
      present_jokers,
      start_pub,
      stop_pub,
      chrono,
      chrono_time
    }
})

export default useController;
