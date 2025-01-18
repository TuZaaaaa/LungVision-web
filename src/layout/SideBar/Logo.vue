<script setup>

</script>

<template>
  <div class="logo">
<!--    <img class="logo-image" :src="getImageUrl('logo.png')" alt="logo.png" />-->
    <h1 class="logo-text">肺CT图像处理分析系统</h1>
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
  }
}
</style>