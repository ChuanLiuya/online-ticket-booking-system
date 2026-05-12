<script setup lang="ts">
import { eventApi } from '@/apis/event'
import { orderApi } from '@/apis/order'
import { AppError } from '@/utils/errors'
import { ElMessage, ElTag, ElButton } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Event } from '@/types/event'
import { Calendar, MapPin, Users, Clock, DollarSign, User, Image as ImageIcon } from '@lucide/vue'
import { formatDate, formatPrice, formatDuration } from '@/utils/format'
import { EventStatus } from '@/types/event'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const event = ref<Event | null>(null)
const loading = ref(false)

onMounted(async () => {
  try {
    const res = await eventApi.findOne(id as string)
    event.value = res.data.data
    console.log(res)
  } catch (error) {
    if (error instanceof AppError) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('获取活动详情失败')
    }
  }
})

const getStatusTag = (status: string) => {
  switch (status) {
    case 'upcoming':
      return { text: '即将开始', type: 'warning' as const }
    case 'ongoing':
      return { text: '进行中', type: 'success' as const }
    case 'completed':
      return { text: '已结束', type: 'info' as const }
    case 'canceled':
      return { text: '已取消', type: 'danger' as const }
    default:
      return { text: status, type: 'warning' as const }
  }
}

const handleSignUp = async () => {
  if (!event.value) return
  
  const eventStatus = event.value.status
  if (eventStatus === EventStatus.CANCELED || eventStatus === EventStatus.COMPLETED) {
    ElMessage.warning('该活动无法报名')
    return
  }
  
  if (event.value.currentParticipants >= event.value.maxParticipants) {
    ElMessage.warning('活动名额已满')
    return
  }
  
  loading.value = true
  try {
    await orderApi.create({ eventId: event.value.id, quantity: 1 })
    ElMessage.success('报名成功！')
    router.push('/profile/orders')
  } catch (error) {
    if (error instanceof AppError) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('报名失败，请稍后重试')
    }
  } finally {
    loading.value = false
  }
}

const canSignUp = () => {
  if (!event.value) return false
  const status = event.value.status
  return status === EventStatus.UPCOMING || status === EventStatus.ONGOING
}
</script>

<template>
  <div class="container" id="container">
    <template v-if="event">
      <div class="event-detail">
        <div class="event-header">
          <h1 class="event-title">{{ event.title || '活动标题' }}</h1>
          <ElTag :type="getStatusTag(event.status).type" class="status-tag">
            {{ getStatusTag(event.status).text }}
          </ElTag>
        </div>

        <div class="event-image-wrapper">
          <el-image
            :src="event.image"
            fit="cover"
            class="event-image"
            lazy
          >
            <template #error>
              <div class="image-placeholder">
                <ImageIcon :size="48" class="placeholder-icon" />
                <span class="placeholder-text">{{ event.title || '活动图片' }}</span>
              </div>
            </template>
          </el-image>
        </div>

        <div class="event-description">
          {{ event.description }}
        </div>

        <div class="event-info-list">
          <div class="info-row">
            <div class="info-icon-wrap"><Calendar :size="18" class="info-icon" /></div>
            <span class="info-label">开始时间</span>
            <div class="info-value-wrap"><span class="info-value">{{ formatDate(event.startTime) }}</span></div>
          </div>

          <div class="info-row">
            <div class="info-icon-wrap"><Clock :size="18" class="info-icon" /></div>
            <span class="info-label">活动时长</span>
            <div class="info-value-wrap"><span class="info-value">{{ formatDuration(event.startTime, event.endTime) }}</span></div>
          </div>

          <div class="info-row">
            <div class="info-icon-wrap"><MapPin :size="18" class="info-icon" /></div>
            <span class="info-label">活动地点</span>
            <div class="info-value-wrap"><span class="info-value">{{ event.location }}</span></div>
          </div>

          <div class="info-row">
            <div class="info-icon-wrap"><DollarSign :size="18" class="info-icon" /></div>
            <span class="info-label">活动价格</span>
            <div class="info-value-wrap"><span class="info-value highlight">{{ formatPrice(event.price) }}</span></div>
          </div>

          <div class="info-row">
            <div class="info-icon-wrap"><User :size="18" class="info-icon" /></div>
            <span class="info-label">组织者</span>
            <div class="info-value-wrap"><span class="info-value">{{ event.organizer?.nickname || event.organizer?.username || '未知' }}</span></div>
          </div>

          <div class="info-row">
            <div class="info-icon-wrap"><Users :size="18" class="info-icon" /></div>
            <span class="info-label">参与人数</span>
            <div class="info-value-wrap"><span class="info-value">{{ event.currentParticipants || 0 }} / {{ event.maxParticipants }}</span></div>
          </div>
        </div>

        <div class="event-actions">
          <ElButton
            v-if="canSignUp()"
            type="primary"
            class="action-btn"
            size="large"
            :loading="loading"
            @click="handleSignUp"
          >
            立即报名
          </ElButton>
          <ElButton
            v-else
            type="default"
            class="action-btn"
            size="large"
            disabled
          >
            {{ event?.status === EventStatus.CANCELED ? '活动已取消' : event?.status === EventStatus.COMPLETED ? '活动已结束' : '名额已满' }}
          </ElButton>
        </div>
      </div>
    </template>
    <template v-else>
      <el-empty description="活动详情不存在" />
    </template>
  </div>
</template>

<style scoped>
#container {
  padding: 24px;
  background-color: #fff;
}

.container {
  margin: 0 auto;
}

.event-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.event-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
}

.event-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0;
  line-height: 1.4;
  word-break: break-word;
  word-wrap: break-word;
}

.status-tag {
  flex-shrink: 0;
  margin-top: 4px;
}

.event-image-wrapper {
  width: 100%;
}

.event-image {
  width: 100%;
  height: 320px;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  color: #999;
}

.placeholder-icon {
  margin-bottom: 8px;
  color: #ccc;
}

.placeholder-text {
  font-size: 14px;
}

.event-description {
  font-size: 16px;
  line-height: 1.8;
  color: #666;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
  word-break: break-word;
  word-wrap: break-word;
}

.event-info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.info-icon-wrap {
  flex-shrink: 0;
  width: 24px;
}

.info-icon {
  color: #409eff;
}

.info-label {
  flex-shrink: 0;
  width: 72px;
  font-size: 13px;
  color: #999;
}

.info-value-wrap {
  flex: 1;
  min-width: 0;
}

.info-value {
  font-size: 15px;
  color: #333;
  font-weight: 500;
  word-break: break-word;
  word-wrap: break-word;
}

.info-value.highlight {
  color: #ee7600;
  font-weight: 700;
  font-size: 16px;
}

.event-actions {
  display: flex;
  gap: 16px;
}

.action-btn {
  flex: 1;
  height: 44px;
  font-size: 16px;
  border-radius: 4px;
}

@media (max-width: 600px) {
  #container {
    padding: 16px;
  }

  .event-title {
    font-size: 22px;
  }

  .event-image {
    height: 200px;
  }

  .image-placeholder {
    height: 200px;
  }



  .event-actions {
    flex-direction: column;
  }
}
</style>
