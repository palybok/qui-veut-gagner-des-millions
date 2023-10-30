import { ref, onUnmounted } from 'vue'
import { defineStore } from 'pinia'
import { useSockets } from '@/stores/sockets'
import { io } from "socket.io-client";
import { useConfig } from '@/stores/config'

export const useForms = defineStore('forms', () => {
  
    // Config
    const config = useConfig()

    // Sockets
    const ws = useSockets()    
    
    // Socket
    const socket = new io(config.socket);

    socket.on('connect', () => {
      console.log("Connected to socket.io server.");
    });

    socket.on('data-updated', async (data) => {
      if (data.type === 'OPEN_FORM') {
        form.value = true;
      }
      if(data.type === 'CLOSE_FORM'){
        form.value = false;
      }
      if(data.type === 'UPDATE_FORM_IPS'){
        const localIP = await getLocalIP(); 
        if (data.ips.includes(localIP)) {
            status.value = 'sent'
        } else {
            status.value = 'waiting'
        }
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

    const form = ref(false)
    const status = ref('sent')

    async function getLocalIP() {
        const pc = new RTCPeerConnection({ iceServers: [] });
        pc.createDataChannel("");
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        return new Promise((resolve) => {
            pc.onicecandidate = event => {
                if (!event || !event.candidate) return;
                const parts = event.candidate.candidate.split(" ");
                const ip = parts[4];
                if (ip.indexOf("::") < 0) {
                    resolve(ip);
                }
            };
        });
    }
    
    async function submit(tag) {
      const ip = await getLocalIP(); // Use await here to get the IP synchronously
      if (status.value === 'sent') return false;

      ws.form_submit(tag, ip);
      status.value = 'sent';
      return true;
    }

    return { 
      form,
      submit,
      status
    }
})
export default useForms;
