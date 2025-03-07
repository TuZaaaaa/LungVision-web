import { createRouter, createWebHistory } from 'vue-router';
import {useUserStore} from "@/stores/user.js";

// 路由配置
const routes = [
  {
    path: '/',
    redirect: '/home/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    redirect: '/home/dashboard',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      requiresAuth: true, // 需要登录权限
    },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/DashboardView.vue'),
      },
      {
        path: 'patientManagement',
        component: () => import('@/views/PatientManagementView.vue'),
      },
      {
        path: 'studyManagement',
        component: () => import('@/views/StudyManagementView.vue'),
      },
      {
        path: 'taskManagement',
        component: () => import('@/views/TaskManagementView.vue'),
      },
    ]
  },
  // 其他路由...
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // // 假设使用某种方式判断是否已登录，比如从 Vuex / Pinia / localStorage 中获取登录状态
  console.log(useUserStore().isLoggedIn)
  const isAuthenticated = useUserStore().isLoggedIn;

  if (to.meta.requiresAuth && !isAuthenticated) {
    // 如果即将访问的路由需要登录，而用户没有登录，则跳转登录页
    next({ name: 'Login' });
  } else {
    // 否则放行
    next();
  }
});

export default router;

