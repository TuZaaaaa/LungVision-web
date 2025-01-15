<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const login = () => {
  // 假设这里从后台拿到了用户名和 token
  const fakeUserData = {
    name: 'Alice',
    token: 'fake-jwt-token-123456'
  }
  userStore.setUserInfo(fakeUserData)
}

const logout = () => {
  userStore.clearUserInfo()
}

</script>

<template>
  <div>
    <h2>用户信息</h2>
    <p v-if="userStore.isLoggedIn">欢迎你，{{ userStore.name }}！</p>
    <p v-else>你还未登录</p>

    <button @click="login">登录</button>
    <button @click="logout">退出登录</button>
  </div>
</template>

<style scoped>

</style>