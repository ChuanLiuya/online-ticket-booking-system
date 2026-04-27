<script setup lang="ts"></script>

<template>
  <div class="container">
    <div>个人中心</div>
    <RouterLink to="/profile/my-events">我的活动</RouterLink>
    <RouterLink to="/profile/joined-events">已参加活动</RouterLink>
    <RouterLink to="/profile/orders">我的订单</RouterLink>
    <RouterLink to="/profile/settings">个人设置</RouterLink>
    <RouterView />
  </div>
</template>

<style scoped>

</style>
