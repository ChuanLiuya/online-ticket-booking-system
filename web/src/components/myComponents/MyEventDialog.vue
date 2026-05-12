<script setup lang="ts">
import type { Event } from '@/types/event'
import { formatDate, formatDuration, formatPrice } from '@/utils/format'
import { EventStatusLabel, EventStatusColor } from '@/types/event'

defineProps<{
  event: Event | null
}>()

const isVisible = defineModel({ type: Boolean, default: false })
</script>

<template>
  <el-dialog title="活动详情" v-model="isVisible" width="600px">
    <div v-if="event" class="event-detail">
      <div class="detail-row">
        <span class="label">活动名称：</span>
        <span class="value">{{ event.title }}</span>
      </div>
      <div class="detail-row">
        <span class="label">活动描述：</span>
        <span class="value">{{ event.description }}</span>
      </div>
      <div class="detail-row">
        <span class="label">活动地点：</span>
        <span class="value">{{ event.location }}</span>
      </div>
      <div class="detail-row">
        <span class="label">开始时间：</span>
        <span class="value">{{ formatDate(event.startTime) }}</span>
      </div>
      <div class="detail-row">
        <span class="label">结束时间：</span>
        <span class="value">{{ formatDate(event.endTime) }}</span>
      </div>
      <div class="detail-row">
        <span class="label">持续时间：</span>
        <span class="value">{{ formatDuration(event.startTime, event.endTime) }}</span>
      </div>
      <div class="detail-row">
        <span class="label">门票价格：</span>
        <span class="value">{{ formatPrice(event.price) }}</span>
      </div>
      <div class="detail-row">
        <span class="label">最大参与人数：</span>
        <span class="value">{{ event.maxParticipants }} 人</span>
      </div>
      <div class="detail-row">
        <span class="label">当前参与人数：</span>
        <span class="value">{{ event.currentParticipants }} 人</span>
      </div>
      <div class="detail-row">
        <span class="label">活动状态：</span>
        <span class="value">
          <el-tag :type="EventStatusColor[event.status]">{{
            EventStatusLabel[event.status]
          }}</el-tag>
        </span>
      </div>
    </div>
    <template #footer>
      <el-button @click="isVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.event-detail {
  padding: 10px;
}
.detail-row {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}
.detail-row:last-child {
  border-bottom: none;
}
.label {
  width: 120px;
  font-weight: 500;
  color: #666;
}
.value {
  flex: 1;
  color: #333;
}
</style>
