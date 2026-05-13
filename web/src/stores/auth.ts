import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { LoginReqBody, User } from '@/types/user'
import { authApi } from '@/apis/auth'
import { userApi } from '@/apis/user'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref<User | null>(null)
  const access_token = ref('')
  const isLoadingUserInfo = ref(false)

  // 计算属性
  const isLoggedIn = computed(() => user.value !== null && access_token.value !== '')

  async function login(data: LoginReqBody) {
    const res = await authApi.login(data)
    access_token.value = res.data.data.access_token
    user.value = res.data.data.user
    localStorage.setItem('user', JSON.stringify(res.data.data.user))
    localStorage.setItem('access_token', res.data.data.access_token)
  }

  async function getMe() {
    isLoadingUserInfo.value = true
    try {
      const res = await userApi.getMe()
      console.log('获取当前登录用户信息成功', res.data.data)
      user.value = res.data.data
      access_token.value = localStorage.getItem('access_token') || ''
      localStorage.setItem('user', JSON.stringify(res.data.data))
    } finally {
      isLoadingUserInfo.value = false
    }
  }

  function logout() {
    user.value = null
    access_token.value = ''
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
  }



  return {
    user,
    isLoadingUserInfo,
    access_token,
    isLoggedIn,
    login,
    getMe,
    logout,
  }
})
