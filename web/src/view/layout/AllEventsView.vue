<script setup lang="ts">
import { AppError } from '@/utils/errors'
import { ElMessage } from 'element-plus'
import { computed, onMounted, ref } from 'vue'
import { EventStatus, type Event } from '@/types/event'
import { formatDate, formatPrice, formatDuration } from '@/utils/format'
import router from '@/router'
import { useEventActions } from '@/composables/useEventActions'

const { findAllEvents } = useEventActions()

const currentPage = ref(1)
const pageSize = ref(10)
const allEvents = ref<Event[]>([])
const total = ref(0)
const allEventsCut = computed(() => {
  const titleMaxLength = 20
  const descriptionMaxLength = 100
  const locationMaxLength = 20
  return allEvents.value.map((event) => {
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
      location: locationCut,
    }
  })
})

const handleCurrentChange = async () => {
  try {
    const res = await findAllEvents({ page: currentPage.value, limit: pageSize.value })
    allEvents.value = res.events || []
    total.value = res.total || 0
  } catch (error) {
    if (error instanceof AppError) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('遇到未知错误，请稍后重试')
    }
  }
}
const handleClick = (id: string) => {
  router.push({ name: 'event-detail', params: { id } })
}
onMounted(async () => {
  await handleCurrentChange()
})
</script>

<template>
  <div class="container" id="container">
    <div class="title">所有活动</div>
    <div class="event-list">
      <div
        v-for="event in allEventsCut"
        :key="event.id"
        class="event-item"
        @click="handleClick(event.id)"
      >
        <div class="event-title">{{ event.title }}</div>
        <div class="event-description">{{ event.description }}</div>
        <div class="event-info">
          <div>发起人: {{ event.organizer.nickname || event.organizer.username }}</div>
          <div>地点: {{ event.location }}</div>
          <div>时间: {{ formatDate(event.startTime) }}</div>
          <div>时长: {{ formatDuration(event.startTime, event.endTime) }}</div>
          <div>价格: {{ formatPrice(event.price) }}</div>
          <div>参与人数: {{ event.currentParticipants }}/{{ event.maxParticipants }}</div>
          <div>
            状态:
            <span
              :class="{
                'status-upcoming': event.status === EventStatus.UPCOMING,
                'status-ongoing': event.status === EventStatus.ONGOING,
                'status-completed': event.status === EventStatus.COMPLETED,
                'status-cancelled': event.status === EventStatus.CANCELED,
              }"
            >
              {{
                event.status === EventStatus.UPCOMING
                  ? '即将开始'
                  : event.status === EventStatus.ONGOING
                    ? '进行中'
                    : event.status === EventStatus.COMPLETED
                      ? '已结束'
                      : '已取消'
              }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <el-empty class="no-events" v-if="allEventsCut.length === 0" description="暂无活动" />
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        background
        layout="prev, pager, next, jumper"
        :total="total"
        @current-change="handleCurrentChange"
      />
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
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  text-align: center;
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

.status-upcoming {
  color: #409eff;
  font-weight: bold;
}

.status-ongoing {
  color: #67c23a;
  font-weight: bold;
}

.status-completed {
  color: #909399;
  font-weight: bold;
}

.status-cancelled {
  color: #f56c6c;
  font-weight: bold;
}
</style>
