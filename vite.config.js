import { fileURLToPath, URL } from 'node:url'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver, ElementPlusResolver, VantResolver } from 'unplugin-vue-components/resolvers'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import fs from 'fs';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [
    vue(), 
    vueJsx(), 
    Components({
    resolvers: [
      AntDesignVueResolver(),
      ElementPlusResolver(),
      VantResolver(),
    ],
  })],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
}));