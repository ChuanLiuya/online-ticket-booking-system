<script setup lang="ts"></script>

<template>
  <div class="container">
    <div class="header">
      <div class="header-buttons">
        <el-button>创建活动</el-button>
      </div>
    </div>
    <div class="content">
      <el-empty description="暂无活动，快去创建一个活动吧~" />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
.header {
  display: flex;
  justify-content: flex-end;
}
.content {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
