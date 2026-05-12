<script setup lang="ts">
import type { Order } from '@/types/order'
import { formatDate, formatDuration } from '@/utils/format'
import { OrderStatusLabel, OrderStatusColor } from '@/types/order'

defineProps<{
  order: Order | null
}>()

const isVisible = defineModel({ type: Boolean, default: false })
</script>

<template>
  <el-dialog title="订单详情" v-model="isVisible" width="600px">
    <div v-if="order" class="order-detail">
      <div class="detail-row">
        <span class="label">订单号：</span>
        <span class="value">{{ order.orderNo }}</span>
      </div>
      <div class="detail-row">
        <span class="label">活动名称：</span>
        <span class="value">{{ order.event.title }}</span>
      </div>
      <div class="detail-row">
        <span class="label">活动地点：</span>
        <span class="value">{{ order.event.location }}</span>
      </div>
      <div class="detail-row">
        <span class="label">开始时间：</span>
        <span class="value">{{ formatDate(order.event.startTime) }}</span>
      </div>
      <div class="detail-row">
        <span class="label">持续时间：</span>
        <span class="value">{{ formatDuration(order.event.startTime, order.event.endTime) }}</span>
      </div>
      <div class="detail-row">
        <span class="label">发起人：</span>
        <span class="value">{{ order.event.organizer.nickname || order.event.organizer.username }}</span>
      </div>
      <div class="detail-row">
        <span class="label">购买数量：</span>
        <span class="value">{{ order.quantity }} 张</span>
      </div>
      <div class="detail-row">
        <span class="label">单价：</span>
        <span class="value">¥{{ order.unitPrice }}</span>
      </div>
      <div class="detail-row">
        <span class="label">总价：</span>
        <span class="value total">¥{{ order.totalAmount }}</span>
      </div>
      <div class="detail-row">
        <span class="label">订单状态：</span>
        <span class="value">
          <el-tag :type="OrderStatusColor[order.status]">{{
            OrderStatusLabel[order.status]
          }}</el-tag>
        </span>
      </div>
      <div class="detail-row">
        <span class="label">下单时间：</span>
        <span class="value">{{ formatDate(order.createdAt) }}</span>
      </div>
      <div class="detail-row" v-if="order.paidAt">
        <span class="label">支付时间：</span>
        <span class="value">{{ formatDate(order.paidAt) }}</span>
      </div>
      <div class="detail-row" v-if="order.cancelledAt">
        <span class="label">取消时间：</span>
        <span class="value">{{ formatDate(order.cancelledAt) }}</span>
      </div>
    </div>
    <template #footer>
      <el-button @click="isVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.order-detail {
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
.value.total {
  color: #ef4444;
  font-size: 18px;
  font-weight: bold;
}
</style>
