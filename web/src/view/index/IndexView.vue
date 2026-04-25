<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
<template>
  <div class="container">
    <h1>欢迎进入电影票务系统</h1>
    <el-button type="primary" @click="router.push('/layout')">点击进入</el-button>
  </div>
</template>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

h1 {
  font-size: 3rem;
  margin-bottom: 2rem;

}
</style>
