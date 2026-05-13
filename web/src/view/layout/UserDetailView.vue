<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserActions } from '@/composables/useUserActions'

const { getUserInfoById } = useUserActions()

const route = useRoute()
const router = useRouter()
const userId : Ref<string> = ref(route.params.id as string)
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
onMounted(async () => {
  const user = await getUserInfoById(userId.value)
})
</script>

<template>
  <div class="container" id="container">
    <div class="info-card">

    </div>
    <el-tabs v-model="activeTab" class="tabs" id="tabs">
      <el-tab-pane class="tab-link" label="个人活动" :name='`/users/${userId}/events`' />
      <el-tab-pane class="tab-link" label="评论" :name='`/users/${userId}/comments-from-others`' />
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
 .info-card {
    margin: 20px 20px 5px 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    background-color: #f9f9f9;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    &:hover {
      cursor: pointer;
      transform: translateY(-1px);
      box-shadow: 0 1px 15px rgba(0, 0, 0, 0.1);
    }
  }
</style>
