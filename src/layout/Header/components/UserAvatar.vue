<script setup>
import IconifyIcon from '@/components/Icon/IconifyIcon.vue'
import {useUserStore} from "@/stores/user.js";
import {useRouter} from "vue-router";

const router = useRouter()  // 获取路由实例
const exit = () => {
  useUserStore().clearUserInfo()
  router.push({ path: '/login' });

}
</script>

<template>
  <!-- 用户头像 -->
<!--  <el-avatar :size="35" :src="defaultAvatarUrl.value" />-->
  <!-- 用户信息 -->
  <el-dropdown trigger="click">
    <span class="el-dropdown-link">
      {{ useUserStore().getUserName }}
      <el-icon class="el-icon--right">
        <iconify-icon icon-name="formkit:down"></iconify-icon>
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
<!--        <el-dropdown-item>个人中心</el-dropdown-item>-->
        <el-dropdown-item @click="exit">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
.nav-right__user {
  display: flex;
  align-items: center;

  i {
    font-size: 14px;
  }
}

.el-dropdown {
  color: $font-size-black;

  .el-dropdown-link {
    display: flex;
    align-items: center;
    margin-left: 5px;
    font-size: 16px;
    font-weight: bold;
  }
  :hover {
    cursor: pointer;
  }
}
</style>