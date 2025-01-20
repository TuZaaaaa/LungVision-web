<script setup>
/** 引入useLayoutStore */
import { useLayoutStore } from '@/stores/layout'
/** 引入storeToRefs()，从store中解构属性保持响应性 */
import { storeToRefs } from 'pinia'
/** 引入animate.css */
// import 'animate.css'


/** 创建layoutStore */
const layoutStore = useLayoutStore()

/** 从layoutStore中解构属性 */
const { isCollapse } = storeToRefs(layoutStore)

</script>

<template>
  <div class="logo">
<!--    <img class="logo-image" :src="getImageUrl('logo.png')" alt="logo.png" />-->
    <Transition enter-active-class="animate__animated animate__fadeInDown" mode="out-in">
      <h1 class="logo-text" v-if="!isCollapse">肺CT图像处理分析系统</h1>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.logo {
  display: flex; // 让logo和文字一行显示
  justify-content: center; // flex容器内子项水平居中
  align-items: center; // flex容器内子项垂直居中
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
    animation: slideIn 0.5s forwards;
  }
}
/* 动画效果 */
@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>