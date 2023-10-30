import { ref, onUnmounted } from 'vue'
import { defineStore } from 'pinia'
import { io } from "socket.io-client";
import { useConfig } from '@/stores/config'

export const useSounds = defineStore('sounds', () => {

    // Config
    const config = useConfig()

    // Socket
    const socket = new io(config.socket);   

    // Actual sound
    const play = ref("")

    // Actual loop
    const loop = ref()

    // Actual sound effect
    const play_effect = ref("")

    // Actual loop effect
    const loop_effect = ref()

    
    socket.on('connect', () => {
      console.log("Connected to socket.io server.");
    });
    
    socket.on('data-updated', (data) => {
      if (data.type === 'UPDATE_SOUND') {
        select(data.sound, data.loop)
      }
      if(data.type === 'UPDATE_SOUND_EFFECT'){
        select_effect(data.sound, data.loop)
      }
    });

    socket.on('disconnect', () => {
      console.log("Disconnected from socket.io server.");
    });

    socket.on('error', (error) => {
      console.error("socket.io Error:", error);
    });

    // Properly disconnect from socket.io server when component unmounts
    onUnmounted(() => {
      socket.disconnect();
    });
    
    function get_file(sound){
      return `${sound}.mp3`      
    }

    function select(sound, shouldLoop){
      loop.value = shouldLoop ?? false

      if(play.value !== ""){
        play.value = ""
      }
      
      setTimeout(() => {
        play.value = get_file(sound)
      }, 100)
    }

    function select_effect(sound, shouldLoop){
      loop_effect.value = shouldLoop ?? false

      if(play_effect.value !== ""){
        play_effect.value = ""
      }
      
      setTimeout(() => {
        play_effect.value = get_file(sound)
      }, 100)
    }

    return { 
      loop,
      play,
      loop_effect,
      play_effect,
    }
})
export default useSounds;
