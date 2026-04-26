<template>
  <el-popover placement="bottom" v-if="userStore.isLoggedIn">
    <template #reference>
      <el-avatar class="avatar">{{
        userStore?.user?.nickname?.[0] || userStore?.user?.username?.[0] || '用户'
      }}</el-avatar>
    </template>
    <template #default>
      <div>
        <el-button type="primary" size="mini">个人中心</el-button>
        <el-button type="primary" size="mini">退出登录</el-button>
      </div>
    </template>
  </el-popover>
  <el-avatar class="avatar" v-else @click="emit('login-click')">登录</el-avatar>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const emit = defineEmits(['login-click']);
</script>

<style scoped>
.avatar {
  cursor: pointer;
  background: black;
  &:hover {
    background: #409eff;
  }
}
</style>
