<script setup>
/** 引入useLayoutStore */
import { useLayoutStore } from '@/stores/layout'
import { storeToRefs } from 'pinia'

/** 创建layoutStore */
const layoutStore = useLayoutStore()

/** 从layoutStore中解构属性 */
const { isCollapse } = storeToRefs(layoutStore)

</script>

<template>
  <div class="logo">
    <!-- <img class="logo-image" :src="getImageUrl('logo.png')" alt="logo.png" /> -->
    <Transition name="fade-scale" mode="out-in">
      <h1 class="logo-text" v-if="!isCollapse">肺CT图像处理分析系统</h1>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  background-color: $sidebar-bg-color;

  &-image {
    margin-right: 5px;
    width: 32px;
    height: 32px;
  }

  &-text {
    font-size: 16px;
    font-weight: bolder;
    color: #fff;
  }
}

/* Vue 过渡动画 */
.fade-scale-enter-active, .fade-scale-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-scale-enter-from, .fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
