import { ref, onUnmounted } from 'vue'
import { defineStore } from 'pinia'
import { io } from "socket.io-client";
import { useConfig } from '@/stores/config'

export const useSockets = defineStore('sockets', () => {
  
    // Config
    const config = useConfig()

    // Socket
    const socket = new io(config.socket);
  
    socket.on('connect', () => {
      console.log("Connected to socket.io server.");
    });

    socket.on('disconnect', () => {
      console.log("Disconnected from socket.io server.");
    });

    socket.on('error', (error) => {
      console.error("socket.io Error:", error);
    });

    
    function question(question, answers){      
      // Emit the new question and answers to the clients
      socket.emit('update-data', { 
        type: 'UPDATE_QUESTION', 
        question: question, 
        answers: answers 
      });
      return true;
    }

    function sound(sound, loop){
      // Emit the new sound to the clients
      socket.emit('update-data', {
        type: 'UPDATE_SOUND',
        sound: sound,
        loop: loop
      });
    }

    function sound_effect(sound, loop){
      // Emit the new sound to the clients
      socket.emit('update-data', {
        type: 'UPDATE_SOUND_EFFECT',
        sound: sound,
        loop: loop
      });
    }

    function joker(joker){
      // Emit the new joker status to the clients
      socket.emit('update-data', { 
        type: 'UPDATE_JOCKER', 
        joker: joker
      });

      return true;
    }

    function form_show_url(){
      // Emit the new form status to the clients
      socket.emit('update-data', { 
        type: 'SHOW_FORM_URL',
      });

      return true;
    }

    function form_hide_url(){
      // Emit the new form status to the clients
      socket.emit('update-data', { 
        type: 'HIDE_FORM_URL',
      });

      return true;
    }

    function form_open(){
      // Emit the new form status to the clients
      socket.emit('update-data', { 
        type: 'OPEN_FORM'
      });

      return true;
    }

    function form_close(){
      // Emit the new form status to the clients
      socket.emit('update-data', { 
        type: 'CLOSE_FORM'
      });

      return true;
    }

    function form_submit(tag, ip){
      // Emit the new form status to the clients
      socket.emit('update-data', { 
        type: 'SUBMIT_FORM',
        tag: tag,
        ip: ip
      });

      return true;
    }

    function form_ips(ips){
      // Emit the new form status to the clients
      socket.emit('update-data', { 
        type: 'UPDATE_FORM_IPS',
        ips: ips
      });

      return true;
    }

    function form_show_stats(stats){
      // Emit the new form status to the clients
      socket.emit('update-data', { 
        type: 'SHOW_FORM_STATS',
        stats: stats
      });

      return true;
    }

    function start_chrono(s){
      // Emit the new form status to the clients
      socket.emit('update-data', { 
        type: 'START_CHRONO',
        time: s
      });

      return true;
    }

    function stop_chrono(){
      // Emit the new form status to the clients
      socket.emit('update-data', { 
        type: 'STOP_CHRONO'
      });
    }

    function win(last_amount, amount, next_amount){
      // Emit the new form status to the clients
      socket.emit('update-data', { 
        type: 'WIN',
        last_amount: last_amount,
        amount: amount,
        next_amount: next_amount
      });
      
    }

    function lose(lost_amount, amount){
      // Emit the new form status to the clients
      socket.emit('update-data', { 
        type: 'LOSE',
        lost_amount: lost_amount,
        amount: amount,
      });
    }

    function new_party(){
      // Emit the new form status to the clients
      socket.emit('update-data', {
        type: 'NEW_PARTY'
      });
    }

    function pallier_present(show){      
      if(show){
        pallier_show(true)
        socket.emit('update-data', { 
          type: 'PALLIER_PRESENTATION_ON'
        });
      }else{
        pallier_show(false)
        socket.emit('update-data', { 
          type: 'PALLIER_PRESENTATION_OFF'
        });
      }
    }

    function pallier_show(show){      
      if(show){
        socket.emit('update-data', { 
          type: 'PALLIER_SHOW'
        });
      }else{
        socket.emit('update-data', { 
          type: 'PALLIER_HIDE'
        });
      }
    }

    function joker_present(){
      socket.emit('update-data', { 
        type: 'JOKER_PRESENT'
      });
    }

    // Properly disconnect from socket.io server when component unmounts
    onUnmounted(() => {
      socket.disconnect();
    });

    return { 
        question,
        sound,
        sound_effect,
        joker,    
        form_open,
        form_close,
        form_show_url,
        form_hide_url,
        form_submit,
        form_ips,
        form_show_stats,
        start_chrono,
        stop_chrono,
        win,
        lose,
        pallier_present,
        pallier_show,
        new_party,
        joker_present
    }
})
export default useSockets;
