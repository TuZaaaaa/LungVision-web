import { createRouter, createWebHistory } from 'vue-router';

// 路由配置
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      requiresAuth: true, // 需要登录权限
    },
  },
  // 其他路由...
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // 假设使用某种方式判断是否已登录，比如从 Vuex / Pinia / localStorage 中获取登录状态
  const isAuthenticated = Boolean(localStorage.getItem('token'));
  // const isAuthenticated = stores.state.isLoggedIn; // 例如从 stores 中获取

  if (to.meta.requiresAuth && !isAuthenticated) {
    // 如果即将访问的路由需要登录，而用户没有登录，则跳转登录页
    next({ name: 'Login' });
  } else {
    // 否则放行
    next();
  }
});

export default router;

