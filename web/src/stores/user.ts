import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { LoginReqBody, User } from '@/types/user'
import { authApi } from '@/apis/auth'

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref<User | null>(null)
  const access_token = ref('')

  // 计算属性
  const isLoggedIn = computed(() => user.value !== null && access_token.value !== '')

  async function login(data: LoginReqBody) {
    const res = await authApi.login(data)
    access_token.value = res.data.data.access_token
    user.value = res.data.data.user
    localStorage.setItem('user', JSON.stringify(res.data.data.user))
    localStorage.setItem('access_token', res.data.data.access_token)
  }

  return {
    user,
    access_token,
    isLoggedIn,
    login,
  }
})
