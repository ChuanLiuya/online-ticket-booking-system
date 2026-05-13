<template>
  <el-popover placement="bottom" v-if="authStore.isLoggedIn">
    <template #reference>
      <el-avatar class="avatar">{{
        authStore?.user?.nickname?.[0] || authStore?.user?.username?.[0] || '用户'
      }}</el-avatar>
    </template>
    <template #default>
      <div class="avatar-card">
        <div class="avatar-card-name">
          {{ authStore?.user?.nickname || authStore?.user?.username }}
        </div>
        <div class="avatar-card-button" @click="$router.push('/profile')">
          <User :size="20" />个人中心
        </div>
        <div class="avatar-card-button" @click="$router.push('/profile/settings')">
          <Settings :size="20" />账号设置
        </div>
        <div class="avatar-card-button" @click="handleLogoutButtonClick">
          <LogOut :size="20" />退出登录
        </div>
      </div>
    </template>
  </el-popover>
  <el-avatar class="avatar" v-else @click="emit('login-click')">登录</el-avatar>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { User, LogOut, Settings } from '@lucide/vue'
import { ElMessageBox } from 'element-plus'

const authStore = useAuthStore()

function handleLogoutButtonClick() {
  ElMessageBox.confirm('确定退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    authStore.logout()
  }).catch(() => {
    // 退出登录取消
  })
}

const emit = defineEmits(['login-click'])
</script>

<style scoped>
.avatar {
  cursor: pointer;
  background: black;
  font-size: 20px;
  transition: all 0.3s ease;
  &:hover {
    animation: bounce 0.6s ease;
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-8px);
  }
  50% {
    transform: translateY(0);
  }
  75% {
    transform: translateY(-4px);
  }
}
.avatar-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px;
  text-align: center;
  color: rgb(107, 109, 113);
  transition: all 0.3s ease;
  .avatar-card-name {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .avatar-card-button {
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 5px;
    &:hover {
      transition: all 0.3s ease;
      background: #e5eaf3;
    }
  }
}
</style>
