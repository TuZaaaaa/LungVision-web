<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed } from "vue";
import { DataAnalysis, User, View, Timer } from "@element-plus/icons-vue";

const router = useRouter();
const route = useRoute();

// 路由路径与菜单 index 的映射
const indexMap = {
  '/home/dashboard': '1',
  '/home/patientManagement': '2',
  '/home/studyManagement': '3',
  '/home/taskManagement': '4'
};

// 当前高亮菜单的 index
const activeIndex = computed(() => {
  return indexMap[route.path] || '1';
});

// 点击菜单跳转路由
const handleMenuItemClick = (index) => {
  const path = Object.keys(indexMap).find(key => indexMap[key] === index)
  if (path && route.path !== path) {
    router.push({ path });
  }
}
</script>

<template>
  <el-menu
      :default-active="activeIndex"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
    <el-menu-item index="1" @click="handleMenuItemClick('1')">
      <el-icon><DataAnalysis /></el-icon>
      <span>数据看板</span>
    </el-menu-item>
    <el-menu-item index="2" @click="handleMenuItemClick('2')">
      <el-icon><User /></el-icon>
      <span>患者管理</span>
    </el-menu-item>
    <el-menu-item index="3" @click="handleMenuItemClick('3')">
      <el-icon><View /></el-icon>
      <span>检查管理</span>
    </el-menu-item>
    <el-menu-item index="4" @click="handleMenuItemClick('4')">
      <el-icon><Timer /></el-icon>
      <span>任务管理</span>
    </el-menu-item>
  </el-menu>
</template>

<style lang="scss" scoped>
.el-menu-item:hover {
  background-color:  transparent;
}

.el-menu-item {
  &::after {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 0;
    transform: translate(-50%, -50%) scale(0);
    transform-origin: 0 bottom;
    content: '';
    width: 95%;
    height: 80%;
    background-color: $brand-color;
    border-radius: 5px;
    transition: transform 0.3s;
  }
}

.el-menu-item.is-active {
  position: relative;
  color: #fff !important;

  .el-icon {
    z-index: 1;
    color: #fff !important;
  }
  span {
    z-index: 1;
    color: #fff !important;
  }

  &::after {
    transform: translate(-50%, -50%) scale(1);
  }
}

// 其它相关样式
.el-sub-menu {
  &.is-active {
    > :deep(.el-sub-menu__title) {
      color: #fff !important;
      :deep(.el-icon) {
        color: #fff !important;
      }
    }
  }
  :deep(.el-sub-menu__title) {
    &:hover {
      color: #fff !important;
    }
  }
}
</style>