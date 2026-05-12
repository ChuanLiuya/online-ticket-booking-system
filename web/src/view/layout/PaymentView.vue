<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import { formatDate, formatDuration, formatPrice } from '@/utils/format'
import { OrderStatus, OrderStatusLabel, OrderStatusColor } from '@/types/order'
import { ElLoading, ElMessage } from 'element-plus'
import { EventStatusColor, EventStatusLabel } from '@/types/event'
import { AppError } from '@/utils/errors'

const orderStore = useOrderStore()
const route = useRoute()
const router = useRouter()
const orderId = route.params.orderId
const isLoadingOrderDetail = ref(true)
onMounted(async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '加载订单详情中...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  isLoadingOrderDetail.value = true

  const timeoutTimer = setTimeout(() => {
    isLoadingOrderDetail.value = false
    loadingInstance.close()
  }, 5000)

  try {
    await orderStore.setSelectedOrder(orderId as string)
  } finally {
    clearTimeout(timeoutTimer)
    loadingInstance.close()
    isLoadingOrderDetail.value = false
  }
})

const handlePaymentClick = async () => {
  if (!orderStore.selectedOrder || orderStore.selectedOrder.status !== OrderStatus.PENDING) {
    ElMessage.warning('该订单无法支付')
    return
  }
  try {
    await orderStore.createPayment(orderStore.selectedOrder.id)
    ElMessage.success('支付请求已提交，请等待支付结果')
  } catch (error) {
    if (error instanceof AppError) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('支付失败，请稍后重试')
    }
  }
}
</script>

<template>
  <div class="container" id="container">
    <div v-if="orderStore.selectedOrder" class="order-detail">
      <div class="title">订单详情</div>

      <div class="detail-row">
        <span class="sub-title">订单信息</span>
      </div>
      <div class="detail-row">
        <span class="label">订单ID：</span>
        <span class="value">{{ orderStore.selectedOrder.id }}</span>
      </div>
      <div class="detail-row">
        <span class="label">订单号：</span>
        <span class="value">{{ orderStore.selectedOrder.orderNo }}</span>
      </div>
      <div class="detail-row">
        <span class="label">购买数量：</span>
        <span class="value">{{ orderStore.selectedOrder.quantity }} 张</span>
      </div>

      <div class="detail-row">
        <span class="label">单价：</span>
        <span class="value">{{ formatPrice(orderStore.selectedOrder.unitPrice) }}</span>
      </div>

      <div class="detail-row">
        <span class="label">总价：</span>
        <span class="value total">{{ formatPrice(orderStore.selectedOrder.totalAmount) }}</span>
      </div>
      <div class="detail-row">
        <span class="label">订单状态：</span>
        <span class="value">
          <el-tag :type="OrderStatusColor[orderStore.selectedOrder.status]">
            {{ OrderStatusLabel[orderStore.selectedOrder.status] }}
          </el-tag>
        </span>
      </div>

      <div class="detail-row">
        <span class="label">下单时间：</span>
        <span class="value">{{ formatDate(orderStore.selectedOrder.createdAt) }}</span>
      </div>

      <div class="detail-row">
        <span class="sub-title">活动信息</span>
      </div>
      <div class="detail-row">
        <span class="label">活动ID：</span>
        <span class="value">{{ orderStore.selectedOrder.event.id }}</span>
      </div>
      <div class="detail-row">
        <span class="label">活动名称：</span>
        <span class="value">{{ orderStore.selectedOrder.event.title }}</span>
      </div>

      <div class="detail-row">
        <span class="label">活动地点：</span>
        <span class="value">{{ orderStore.selectedOrder.event.location }}</span>
      </div>
      <div class="detail-row">
        <span class="label">活动描述：</span>
        <span class="value">{{ orderStore.selectedOrder.event.description }}</span>
      </div>
      <div class="detail-row">
        <span class="label">开始时间：</span>
        <span class="value">{{ formatDate(orderStore.selectedOrder.event.startTime) }}</span>
      </div>

      <div class="detail-row">
        <span class="label">持续时间：</span>
        <span class="value">{{
          formatDuration(
            orderStore.selectedOrder.event.startTime,
            orderStore.selectedOrder.event.endTime,
          )
        }}</span>
      </div>

      <div class="detail-row">
        <span class="label">发起人：</span>
        <span class="value">{{
          orderStore.selectedOrder.event.organizer.nickname ||
          orderStore.selectedOrder.event.organizer.username
        }}</span>
      </div>

      <div class="detail-row">
        <span class="label">参与人数：</span>
        <span class="value"
          >{{ orderStore.selectedOrder.event.currentParticipants }} /
          {{ orderStore.selectedOrder.event.maxParticipants }}</span
        >
      </div>
      <div class="detail-row">
        <span class="label">活动状态：</span>
        <span class="value">
          <el-tag :type="EventStatusColor[orderStore.selectedOrder.event.status]">
            {{ EventStatusLabel[orderStore.selectedOrder.event.status] }}
          </el-tag>
        </span>
      </div>
      <div class="action-section">
        <el-button class="back-btn" size="large" @click="router.push('/profile/orders')">
          返回订单列表
        </el-button>

        <el-button
          v-if="orderStore.selectedOrder.status === OrderStatus.PENDING"
          type="primary"
          size="large"
          :loading="orderStore.isCheckingPaymentStatus"
          @click="handlePaymentClick"
        >
          <span v-if="orderStore.isCheckingPaymentStatus">支付中...</span>
          <span v-else>立即支付</span>
        </el-button>

        <el-button
          v-else-if="orderStore.selectedOrder.status === OrderStatus.PAID"
          type="success"
          size="large"
          disabled
        >
          已支付
        </el-button>

        <el-button v-else type="default" size="large" disabled> 无法支付 </el-button>
      </div>
    </div>
    <div v-else-if="isLoadingOrderDetail" class="loading-container"></div>
    <div v-else class="order-detail-loading-failed">
      <el-empty description="加载订单详情失败，请稍后重试" image-style="height: 240px" />
    </div>
  </div>
</template>

<style scoped>
#container {
  padding: 20px;
  margin: 0 auto;
}

.order-detail {
  background: #fff;
}

.title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.sub-title {
  font-size: 16px;
  font-weight: 600;
}

.detail-row {
  display: flex;
  padding: 14px 0;
  border-bottom: 1px solid #f5f5f5;
  align-items: center;
}

.detail-row:last-of-type {
  border-bottom: none;
}

.label {
  width: 120px;
  font-weight: 500;
  color: #666;
  font-size: 14px;
}

.value {
  flex: 1;
  color: #333;
  font-size: 14px;
}

.value.total {
  color: #ef4444;
  font-size: 18px;
  font-weight: bold;
}

.action-section {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
  justify-content: flex-end;
}

.checking-status {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #409eff;
  font-size: 14px;
}
</style>
