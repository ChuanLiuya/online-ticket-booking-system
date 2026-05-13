<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const userId = ref(route.params.id)
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
onMounted(() => {

})
</script>

<template>
  <div class="container" id="container">
    <div class="title" id="title">个人中心</div>
    <el-tabs v-model="activeTab" class="tabs" id="tabs">
      <el-tab-pane class="tab-link" label="你好1" name="/profile/my-events" />
      <el-tab-pane class="tab-link" label="你好12" name="/profile/my-tickets" />
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
.tabs {
  padding: 0 32px;
}
.tab-link {
  cursor: pointer;
}
.tab-link:hover {
  color: #409eff;
  text-decoration: underline;
}
</style>
