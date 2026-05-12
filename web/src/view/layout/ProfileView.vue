<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const activeTab = ref(route.path)

watch(activeTab, (val) => {
  router.push(val)
})

watch(
  () => route.path,
  (val) => {
    activeTab.value = val
  },
)
</script>

<template>
  <div class="container" id="container">
    <div class="title" id="title">个人中心</div>
    <el-tabs v-model="activeTab" class="profile-tabs" id="profile-tabs">
      <el-tab-pane label="我的活动" name="/profile/my-events" />
      <el-tab-pane label="已参加活动" name="/profile/joined-events" />
      <el-tab-pane label="我的订单" name="/profile/orders" />
      <el-tab-pane label="个人设置" name="/profile/settings" />
    </el-tabs>
    <RouterView />
  </div>
</template>

<style scoped>
#title {
  margin: 20px;
}
#container {
  height: 0px;
}
.profile-tabs {
  padding: 0 32px;
}
</style>
