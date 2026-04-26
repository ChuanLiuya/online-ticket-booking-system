import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/user'



export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref<User | null>(null)
  const access_token = ref('')

  // 计算属性
  const isLoggedIn = computed(() => user.value !== null && access_token.value !== '')



  return {
    user,
    access_token,
    isLoggedIn,
  }
})
