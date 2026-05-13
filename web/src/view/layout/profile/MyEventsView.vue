<script setup lang="ts">
import MyEventsTable from '@/components/myComponents/MyEventsTable.vue'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
</script>

<template>
  <div v-if="authStore.user?.id">
    <MyEventsTable :user-id="authStore.user.id" />
  </div>
  <div v-else-if="authStore.isLoadingUserInfo">
    加载用户信息中...
  </div>
  <div v-else>
    您当前未登录，无法查看活动
  </div>
</template>
