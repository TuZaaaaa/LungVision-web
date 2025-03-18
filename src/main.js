import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import axiosInstance from '@/services/request.js';
import ElementPlus from 'element-plus'

import '@/assets/styles/_reset.scss'
import 'element-plus/dist/index.css'
// import * as ECharts from 'echarts';
import VChart from 'vue-echarts';


const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(router)
app.use(ElementPlus)
app.use(pinia)
app.component('v-chart', VChart);

// 全局挂载 axios 实例
app.config.globalProperties.$axios = axiosInstance;


app.mount('#app')
