import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useNotifyService } from '@/stores/notify'
import { useConfig } from '@/stores/config'

import axios from 'axios'

export const useTuya = defineStore('tuya', () => {

    // Config
    const config = useConfig()

    const username = config.smartlife_username
    const password = config.smartlife_password
    const session = ref([])
    const devices = ref({})

    // Notify
    const notify = useNotifyService()

    // Axios
    const api = axios.create({ baseURL: 'https://px1.tuyaeu.com/homeassistant' } )

    // Axios Interceptors
    api.interceptors.request.use(
      config => {
          config.url += '?region=eu';
          return config;
        },
        error => {
            return Promise.reject(error)
        }
    )

    function handle_error(error) {
        console.log(error)
        // notify.set_error(error.response.data.message, error.response.status ?? 500)
        // throw new Error(error.response.data.message)
    }

    async function _get(url, successMessage) {
        try {
            const res = await api.get(url)
            if(successMessage) notify.set_success(successMessage)
            return res.data
        } catch (error) {
            handle_error(error)
        }
    }
    
    async function _post(url, data, successMessage) {
        try {
            const res = await api.post(url, data)
            if(successMessage) notify.set_success(successMessage)
            ensure_success(res);
            return res.data
        } catch (error) {
            handle_error(error)
        }
    }

    async function _put(url, data, successMessage) {
        try {
            const res = await api.put(url, data)
            if(successMessage) notify.set_success(successMessage)
            return res.data
        } catch (error) {
            handle_error(error)
        }
    }

    async function _del(url, successMessage) {
        try {
            const res = await api.delete(url)
            if(successMessage) notify.set_success(successMessage)
            return res.data
        } catch (error) {
            handle_error(error)
        }
    }    

    function save_session() {
        localStorage.setItem('session', JSON.stringify(session.value))
        localStorage.setItem('devices', JSON.stringify(devices.value))
    }

    function get_session() {
        let data

        data = localStorage.getItem('session')
        if(data) session.value = JSON.parse(data)

        data = localStorage.getItem('devices')
        if(data) devices.value = JSON.parse(data)
    }

    function reset() {
        session.value = []
    }

    function init() { 
        get_session()        
        api.post('/auth.do', new URLSearchParams({
            userName: username,
            password,
            countryCode: '00',
            bizType: 'smart_life',
            from: 'tuya'
        })).then(response => {
            ensure_success(response)
            session.value = response.data
            save_session()
        }).catch(error => {
            handle_error(error)
        })
    }

    function ensure_success (response) {
        const data = response.data
        if (typeof data !== 'object') {
            throw new Error(data)
        }
        if (data.access_token) {
            return
        }
        if (data.responseStatus === 'error') {
            throw new Error(data.errorMsg)
        }
        if (data.header.code !== 'SUCCESS') {
            throw new Error(data.header.msg)
        }
    }

    // Tuya
    async function device_discovery() {
        get_session()  
                
        if (Object.keys(devices.value).length > 0) {
            return devices.value;
        }

        _post('/skill', {
            header: {
                payloadVersion: 1,
                namespace: 'discovery',
                name: 'Discovery'
            },
            payload: { accessToken: session.value.access_token }
        }).then(response => {
            devices.value = response.payload
            save_session()
        }).catch(error => {
            handle_error(error)
        })
        
        return devices.value;
    }

    async function device_turn_off(device_id) {
        _post('/skill', {
                header: {
                    payloadVersion: 1,
                    namespace: 'control',
                    name: 'turnOnOff'
                },
                payload: { 
                    accessToken: session.value.access_token,
                    devId: device_id,
                    value: 0
                }
            })
    }

    async function device_turn_on(device_id) {
        _post('/skill', {
                header: {
                    payloadVersion: 1,
                    namespace: 'control',
                    name: 'turnOnOff'
                },
                payload: { 
                    accessToken: session.value.access_token,
                    devId: device_id,
                    value: 1
                }
            })
    }

    async function device_color(device_id, color) {
        _post('/skill', {
                header: {
                    payloadVersion: 1,
                    namespace: 'control',
                    name: 'colorSet'
                },
                payload: { 
                    accessToken: session.value.access_token,
                    devId: device_id,
                    color: color
                }
            })
    }

    async function device_brightness(device_id, brightness) {
        _post('/skill', {
                header: {
                    payloadVersion: 1,
                    namespace: 'control',
                    name: 'brightnessSet'
                },
                payload: { 
                    accessToken: session.value.access_token,
                    devId: device_id,
                    brightness: brightness
                }
            })
    }

    async function device_scene(device_id, scene) {
        _post('/skill', {
                header: {
                    payloadVersion: 1,
                    namespace: 'control',
                    name: 'sceneExecute'
                },
                payload: { 
                    accessToken: session.value.access_token,
                    devId: device_id,
                    value: scene
                }
            })
    }

    return { 
        init,
        reset,
        device_discovery,
        device_turn_off,
        device_turn_on,
        device_color,
        device_brightness,
        device_scene,
    }
},
  {
    persist: true,
  },
)
export default useTuya;
