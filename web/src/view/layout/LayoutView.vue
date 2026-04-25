<script setup lang="ts"></script>

<template>
  <el-container class="layout">




    <el-header class="header">
      <div class="logo">在线电影票务</div>
      <div class="search">搜索</div>
      <div class="login">登录</div>
    </el-header>




    <el-container class="body">





      <el-aside width="200px" class="aside">
        <el-menu default-active="2" class="aside-menu">
          <el-menu-item index="1">
            <el-icon></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon><setting /></el-icon>
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
    background-color: aqua;
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
