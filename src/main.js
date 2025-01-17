import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import axiosInstance from '@/services/request.js';
import ElementPlus from 'element-plus'

import '@/assets/styles/reset.css'
import 'element-plus/dist/index.css'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(router)
app.use(ElementPlus)
app.use(pinia)

// 全局挂载 axios 实例
app.config.globalProperties.$axios = axiosInstance;


app.mount('#app')
