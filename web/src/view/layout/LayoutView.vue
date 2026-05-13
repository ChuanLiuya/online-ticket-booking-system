<script setup lang="ts">
import { House } from '@lucide/vue'
import { X } from '@lucide/vue'
import { Search } from '@lucide/vue'
import { onMounted, ref, type Ref } from 'vue'
import MyRegisterDialog from '@/components/myComponents/MyRegisterDialog.vue'
import MyLoginDialog from '@/components/myComponents/MyLoginDialog.vue'
import MyMainAvatar from '@/components/myComponents/MyMainAvatar.vue'
import { useAuthStore } from '@/stores/auth'
import { AppError } from '@/utils/errors'
import { ElMessage } from 'element-plus'
import { User } from '@lucide/vue'

const searchText = ref('')

const dialogState: Ref<'login' | 'register' | 'disabled'> = ref('disabled')
const clickLoginButton = () => {
  dialogState.value = 'login'
}

onMounted(async () => {
  try {
    await useAuthStore().getMe()
    ElMessage.success(`欢迎回来，${useAuthStore().user?.nickname || useAuthStore().user?.username || '用户'}！`)
  } catch (error) {
    if (error instanceof AppError) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('遇到未知错误')
    }
  }
})
</script>

<template>
  <el-container class="layout">
    <el-header class="header">
      <div class="logo">网上购票系统</div>
      <div class="search">
        <el-input
          placeholder="搜索活动"
          v-model="searchText"
          clearable
          :clear-icon="X"
          :prefix-icon="Search"
        ></el-input>
      </div>
      <div class="login">
        <MyMainAvatar @login-click="clickLoginButton" />
      </div>
    </el-header>

    <el-container class="body">
      <el-aside width="200px" class="aside">
        <el-menu :default-active="$route.path" class="aside-menu" :default-openeds="['1']"  router>
          <el-menu-item index="/home">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-sub-menu index="1">
            <template #title
              ><el-icon><User /></el-icon><span>我的</span></template
              >
            <el-menu-item index="/profile" :class="{ 'is-active': $route.path.startsWith('/profile') }">个人中心</el-menu-item>
            <el-menu-item index="/create-event">创建活动</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <el-main class="main">
          <RouterView class="main-inner" />
      </el-main>
    </el-container>
  </el-container>

  <MyRegisterDialog v-model="dialogState" />
  <MyLoginDialog v-model="dialogState" />
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  height: 56px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;

  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    flex-shrink: 0;
    flex-grow: 0;
  }
  .search {
    flex: 1;
  }
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    flex-shrink: 0;
    flex-grow: 0;
    .avatar {
      cursor: pointer;
      background: black;
      &:hover {
        background: #409eff;
      }
    }
  }
}

.aside {
  display: flex;
  flex-direction: column;
  align-items: center;

  .aside-menu {
    width: 100%;
    height: 100%;
  }
}

.main {
  height: 100%;
  width: 100%;
  padding: 0px;
  .main-inner {
    width: 100%;
    height: 100%;
    padding: 0px;
  }
}
</style>
