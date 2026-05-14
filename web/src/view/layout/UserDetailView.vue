<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserActions } from '@/composables/useUserActions'
import type { User } from '@/types/user'

const { getUserInfoById } = useUserActions()

const route = useRoute()
const router = useRouter()
const userId : Ref<string> = ref(route.params.id as string)
const activeTab = ref(route.path)
const userInfo = ref<User>()

watch(activeTab, (val) => {
  router.push(val)
})

watch(
  () => route.path,
  (val) => {
    activeTab.value = val
  },
)
onMounted(async () => {
  // console.log(route.params)
  const user = await getUserInfoById(userId.value)
  userInfo.value = user
})
</script>

<template>
  <div class="container" id="container">
    <div class="info-card">
      <div class="user-info">
        <el-avatar class="avatar">{{ userInfo?.nickname?.[0] || userInfo?.username?.[0] || '用户' }}</el-avatar>
        <div class="user-details">
          <div class="user-name">{{ userInfo?.nickname || userInfo?.username || '用户' }}</div>
          <div class="user-username">用户名：{{ userInfo?.username || '用户' }}</div>
          <div class="user-id">ID: {{ userInfo?.id || '用户' }}</div>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeTab" class="tabs" id="tabs">
      <el-tab-pane class="tab-link" label="个人活动" :name='`/users/${userId}/events`' />
    </el-tabs>
    <RouterView />
  </div>
</template>

<style scoped>
.avatar {
  /* cursor: pointer; */
  background: black;
  font-size: 20px;
  transition: all 0.3s ease;
  &:hover {
    animation: bounce 0.6s ease;
  }
}
#title {
  margin: 20px;
}
#container {
  height: 0px;
}
.tabs {
  padding: 0 32px;
}
.tab-link {
  cursor: pointer;
}
.tab-link:hover {
  color: #409eff;
  text-decoration: underline;
}
.info-card {
    margin: 20px 20px 5px 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    background-color: #f9f9f9;
    transition: all 0.3s ease;
    &:hover {
      /* cursor: pointer; */
      transform: translateY(-1px);
      box-shadow: 0 1px 15px rgba(0, 0, 0, 0.1);
    }
  }
  .user-info {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .user-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .user-name {
    font-size: 18px;
    font-weight: bold;
    /* color: #303133; */
  }
  .user-username {
    font-size: 14px;
    /* color: #909399; */
  }
  .user-id {
    font-size: 12px;
    /* color: #c0c4cc; */
  }
</style>
