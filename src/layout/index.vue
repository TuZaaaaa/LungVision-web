<script setup>
import SideBar from './SideBar/index.vue'
import Header from './Header/index.vue'

/** 引入useLayoutStore */
import { useLayoutStore } from '@/stores/layout'
/** storeToRefs()，从store中解构属性保持响应性 */
import { storeToRefs } from 'pinia'


/** 创建layoutStore */
const layoutStore = useLayoutStore()

/** 从layoutStore中解构出isCollapse属性 */
const { isCollapse } = storeToRefs(layoutStore)

</script>

<template>
  <div class="layout">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '65px' : '200px'">
        <SideBar />
      </el-aside>
      <el-container>
        <!-- 头部 -->
        <el-header>
          <Header />
        </el-header>
        <!-- 主要内容区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  height: 100vh;  /* 设置为视口高度 */
  overflow: hidden;  /* 禁止滚动 */
  .el-aside {
    border-right: solid 1px $border-color;
    background-color: $sidebar-bg-color;
    transition: width 0.5s;
  }
}
</style>