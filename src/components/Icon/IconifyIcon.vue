<script setup lang="ts">
import { Icon as IconifyIcon } from '@iconify/vue'
import { useAttrs } from 'vue'

/** 父组件绑定在子组件上但子组件没有使用props接收的属性 */
const attr = useAttrs()

/** 用来接受父组件传的值 */
const props = withDefaults(defineProps<{ iconName: string }>(), {
  iconName: ''
})
</script>

<template>
  <IconifyIcon :icon="iconName" :style="{ ...attr }" />
</template>

<style scoped>

</style>