import { defineStore } from 'pinia'

/**
 * 用户相关状态和操作
 */
export const useUserStore = defineStore('userStore', {
    // state: 用于存储用户信息
    state: () => ({
        name: '',
        token: '',
    }),

    // getters: 相当于 Vue 中的 computed，用于派生新的状态或简化访问
    getters: {
        isLoggedIn: (state) => {
            return !!state.token
        },
    },

    // actions: 用于修改 state，支持同步或异步操作
    actions: {
        // 设置或更新用户信息
        setUserInfo(payload) {
            this.name = payload.name
            this.token = payload.token
        },

        // 清空用户信息，一般用于退出登录
        clearUserInfo() {
            this.name = ''
            this.token = ''
        },
    },
})
