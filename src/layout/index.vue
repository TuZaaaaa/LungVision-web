<script setup>
import SideBar from './SideBar/index.vue'
</script>

<template>
  <div class="layout">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <SideBar />
      </el-aside>
      <el-container>
        <!-- 头部 -->
        <el-header>Header</el-header>
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
  .el-aside {
    border-right: solid 1px $border-color;
    background-color: $sidebar-bg-color;
  }
}
</style>