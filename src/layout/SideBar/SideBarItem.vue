<script setup>
import { useRouter } from 'vue-router'
import {onMounted} from "vue";
import {DataAnalysis, User, View, Timer, Picture, Printer} from "@element-plus/icons-vue";  // 引入 Vue Router

const router = useRouter()  // 获取路由实例

// 定义菜单项的路由路径
const handleMenuItemClick = (index) => {
  // 根据菜单的 index 来决定跳转的路径
  switch(index) {
    case '1':
      router.push({ path: '/home/dashboard' });  // 跳转到 Dashboard 页面
      break;
    case '2':
      router.push({ path: '/home/patientManagement' });  // 跳转到患者管理页面
      break;
    case '3':
      router.push({ path: '/home/studyManagement' });  // 跳转到检查管理页面
      break;
    case '4':
      router.push({ path: '/home/taskManagement' });  // 跳转到任务管理页面
      break;
    default:
      break;
  }
}

onMounted(() => {
  // router.push({ path: '/home/dashboard' });  // 跳转到 Dashboard 页面
})

</script>

<template>
  <!-- 下拉菜单 -->
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
</template>

<style lang="scss" scoped>


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

  .el-icon {
    z-index: 1;
  }
  span {
    z-index: 1;
  }

  &::after {
    transform: translate(-50%, -50%) scale(1);
  }
}

.el-menu-item {
  &.is-active {
    &:hover {
      span {
        color: #fff;
      }
      :deep(.is-active) {
        background-color: red !important;
      }
    }
  }
}
.el-sub-menu {
  &.is-active {
    > :deep(.el-sub-menu__title) {
      color: #fff !important;


      :deep(.el-icon) {
        color: #fff;
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