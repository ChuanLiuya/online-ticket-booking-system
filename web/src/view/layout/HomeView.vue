<script setup lang="ts">
import { eventApi } from '@/apis/event'
import { AppError } from '@/utils/errors'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import type { Event } from '@/types/event'

const hotEvents = ref<Event[]>([])

onMounted(async () => {
  try {
    const res = await eventApi.findHot()
    hotEvents.value = res.data.data || []
    console.log(hotEvents.value)
  } catch (error) {
    if (error instanceof AppError) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('遇到未知错误，请稍后重试')
    }
   }
})

</script>

<template>
  <div class="container">
    <h2>热点活动</h2>
    <div class="event-list">
      <div v-for="event in hotEvents" :key="event.id" class="event-item">
        <h3>{{ event.title }}</h3>
        <p>{{ event.description }}</p>
        <div class="event-info">
          <span>地点: {{ event.location }}</span>
          <span>时间: {{ event.startTime }}</span>
          <span>价格: ¥{{ event.price }}</span>
          <span>参与人数: {{ event.currentParticipants }}/{{ event.maxParticipants }}</span>
        </div>
      </div>
      <div v-if="hotEvents.length === 0" class="no-events">
        暂无热点活动
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

.event-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.event-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background-color: #f9f9f9;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.event-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.event-item h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
}

.event-item p {
  margin-bottom: 15px;
  color: #666;
  line-height: 1.5;
}

.event-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: #555;
}

.event-info span {
  display: flex;
  align-items: center;
}

.no-events {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: #999;
  background-color: #f5f5f5;
  border-radius: 8px;
}
</style>
