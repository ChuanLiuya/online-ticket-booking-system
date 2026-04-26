<script setup lang="ts">
import { House } from '@lucide/vue';
import { Film } from '@lucide/vue';
import { X } from '@lucide/vue';
import { Search } from '@lucide/vue';
import { ref } from 'vue';

const searchText = ref('');

const handleLogin = () => {
  console.log('登录');
};
</script>

<template>
  <el-container class="layout">




    <el-header class="header">
      <div class="logo">在线电影票务</div>
      <div class="search">
        <el-input placeholder="搜索电影" v-model="searchText" clearable :clear-icon="X" :prefix-icon="Search"></el-input>
      </div>
      <div class="login">
        <el-button @click="handleLogin">登录</el-button>
      </div>
    </el-header>




    <el-container class="body">





      <el-aside width="200px" class="aside">
        <el-menu default-active="2" class="aside-menu" router>
          <el-menu-item index="/home">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/movies">
            <el-icon><Film /></el-icon>
            <span>电影</span>
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
