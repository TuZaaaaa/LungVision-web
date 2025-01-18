<script setup lang="ts">
/** 引入SideBarItem.vue */
import SideBarItem from './SideBarItem.vue'
import Logo from './Logo.vue'

</script>

<template>
  <div class="sidebar">
    <Logo />
    <el-menu default-active="1" text-color="#BBB" background-color="#001428" active-text-color="#fff" class="el-menu-vertical-demo">
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
