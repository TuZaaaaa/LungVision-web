<script setup>
import IconifyIcon from '@/components/Icon/IconifyIcon.vue'
/** 引入 layout store */
import { useLayoutStore } from '@/stores/layout'
/** 引入storeToRef()函数，从store中获取属性保持响应性 */
import { storeToRefs } from 'pinia'
import UserAvatar from "@/layout/Header/components/UserAvatar.vue";

/** layoutstore */
const layoutStore = useLayoutStore()

/** 获取layoutstore中的方法 */
const { changeCollapse } = layoutStore

/** 获取layoutstore中的属性 */
const { isCollapse } = storeToRefs(layoutStore)

console.log('isCollapse', isCollapse)

</script>

<template>
  <div class="nav">
    <!-- 左侧区域 -->
    <div class="nav-left">
      <!-- 折叠图标 -->
<!--      <iconify-icon-->
<!--          :icon-name="isCollapse ? 'ant-design:menu-unfold-outlined' : 'ant-design:menu-fold-outlined'"-->
<!--          @click="changeCollapse">-->
<!--      </iconify-icon>-->
      <!-- 面包屑 -->
    </div>
    <!-- 右侧区域 -->
    <div class="nav-right">
      <UserAvatar />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  height: 50px;
  border-bottom: 1px solid $border-color;
}
</style>