
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {createPinia} from "pinia";
import axiosInstance from '@/services/request.js';

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)

// 全局挂载 axios 实例
app.config.globalProperties.$axios = axiosInstance;


app.mount('#app')
