<script setup lang="ts">
import { House } from '@lucide/vue'
import { Film } from '@lucide/vue'
import { X } from '@lucide/vue'
import { Search } from '@lucide/vue'
import { onMounted, ref, type Ref } from 'vue'
import MyRegisterDialog from '@/components/myComponents/MyRegisterDialog.vue'
import MyLoginDialog from '@/components/myComponents/MyLoginDialog.vue'
import MyMainAvatar from '@/components/myComponents/MyMainAvatar.vue'
import { useUserStore } from '@/stores/user'
import { AppError } from '@/utils/errors'
import { ElMessage } from 'element-plus'

const searchText = ref('')

const dialogState: Ref<'login' | 'register' | 'disabled'> = ref('disabled')
const clickLoginButton = () => {
  dialogState.value = 'login'
}

onMounted(async () => {
  try {
    await useUserStore().getMe()
    ElMessage.success(`欢迎回来，${useUserStore().user?.nickname || useUserStore().user?.username || '用户'}！`)
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
        <el-menu default-active="2" class="aside-menu" router>
          <el-menu-item index="/home">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/events">
            <el-icon><Film /></el-icon>
            <span>活动</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main class="main">
        <div class="main-inner">
          <RouterView />
        </div>
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
  background: #f5f7fa;
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
</style>
