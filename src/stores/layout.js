import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLayoutStore = defineStore('layout', () => {
    /** 控制侧边栏是否收起 */
    const isCollapse = ref(false)

    /** 切换isCollapse的状态 */
    const changeCollapse = ()=> {
        isCollapse.value = !isCollapse.value
    }

    return { isCollapse, changeCollapse }
})
