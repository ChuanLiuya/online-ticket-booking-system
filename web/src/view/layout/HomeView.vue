<script setup lang="ts">
import { eventApi } from '@/apis/event'
import { AppError } from '@/utils/errors'
import { ElMessage } from 'element-plus'
import { computed, onMounted, ref } from 'vue'
import type { Event } from '@/types/event'
import { formatDate, formatPrice, formatDuration } from '@/utils/format'

const hotEvents = ref<Event[]>([])
const hotEventsCut = computed(() => {
  const titleMaxLength = 20
  const descriptionMaxLength = 100
  const locationMaxLength = 20
  return hotEvents.value.map(event => {
    let titleCut = event.title
    let descriptionCut = event.description
    let locationCut = event.location
    if (titleCut.length > titleMaxLength) {
      titleCut = titleCut.slice(0, titleMaxLength) + '...'
    }
    if (descriptionCut.length > descriptionMaxLength) {
      descriptionCut = descriptionCut.slice(0, descriptionMaxLength) + '...'
    }
    if (locationCut.length > locationMaxLength) {
      locationCut = locationCut.slice(0, locationMaxLength) + '...'
    }
    return {
      ...event,
      title: titleCut,
      description: descriptionCut,
      location: locationCut
    }
  })
})
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
  <div class="container" id="container">
    <div class="title">热点活动</div>
    <div class="event-list">
      <div v-for="event in hotEventsCut" :key="event.id" class="event-item">
        <div class="event-title">{{ event.title }}</div>
        <div class="event-description">{{ event.description }}</div>
        <div class="event-info">
          <div>发起人: {{ event.organizer.nickname || event.organizer.username }}</div>
          <div>地点: {{ event.location }}</div>
          <div>时间: {{ formatDate(event.startTime) }}</div>
          <div>时长: {{ formatDuration(event.startTime, event.endTime) }}</div>
          <div>价格: {{ formatPrice(event.price) }}</div>
          <div>参与人数: {{ event.currentParticipants }}/{{ event.maxParticipants }}</div>
        </div>
      </div>
      <div v-if="hotEventsCut.length === 0" class="no-events">暂无热点活动</div>
    </div>
  </div>
</template>

<style scoped>
#container {
  padding: 20px;
}
.container {
  margin: 0 auto;
  padding: 20px;
}
.title {
  margin-bottom: 20px;
  color: #333;
  font-size: 24px;
  font-weight: bold;
}

.event-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  overflow-wrap: break-word;
  .event-item {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    background-color: #f9f9f9;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    &:hover {
      cursor: pointer;
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    .event-title {
      flex: 0;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .event-description {
      flex: 0;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .event-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-start;
      gap: 2px;
      font-size: 14px;
      color: #666;
    }
  }
}
</style>
