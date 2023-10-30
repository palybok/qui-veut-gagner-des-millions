import './global-shim.js';

import { createApp } from 'vue'
import App from './App.vue'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { fa } from "vuetify/iconsets/fa";
import { aliases, mdi } from "vuetify/lib/iconsets/mdi";
import Notifications from '@kyvg/vue3-notification'


import "@mdi/font/css/materialdesignicons.css";
import "@fortawesome/fontawesome-free/css/all.css";

import router from './router'
import 'animate.css';

import {
  VDataTable,
  VDataTableServer,
  VDataTableVirtual,
} from "vuetify/labs/VDataTable";

export default createVuetify({
})


const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
      fa,
    },
  },
  components: {
    ...components,
    VDataTable,
    VDataTableServer,
    VDataTableVirtual
  },
  directives,
})

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(vuetify)
app.use(pinia);
app.use(Notifications)
app.use(router)
app.mount('#app')
