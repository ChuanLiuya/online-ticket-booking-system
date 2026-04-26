import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/user'



export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref<User | null>(null)
  const accessToken = ref('')

  // 计算属性
  const isLoggedIn = computed(() => user.value !== null && accessToken.value !== '')



  return {
    user,
    accessToken,
    isLoggedIn,
  }
})
