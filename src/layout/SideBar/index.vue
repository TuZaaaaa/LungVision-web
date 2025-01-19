<script setup lang="ts">
/** 引入SideBarItem.vue */
import SideBarItem from './SideBarItem.vue'
import Logo from './Logo.vue'

/** 引入 layoutstore */
import { useLayoutStore } from '@/stores/layout'
/** 引入storeToRef()函数，从store中解构属性保持响应性 */
import { storeToRefs } from 'pinia'

/** 创建useLayoutStore */
const layoutStore = useLayoutStore()

/** 获取layoutStore中的属性 */
const { isCollapse } = storeToRefs(layoutStore)
</script>

<template>
  <div class="sidebar">
    <Logo />
    <el-menu default-active="1" text-color="#BBB" background-color="#001428" active-text-color="#fff" class="el-menu-vertical-demo" :collapse="isCollapse">
      <SideBarItem />
    </el-menu>
  </div>
</template>

<style lang="scss" scoped>
.el-menu {
  height: 100vh;
  border-right: 0;
  background-color: $sidebar-bg-color;
}

</style>
