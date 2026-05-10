<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { orderApi } from '@/apis/order'
import { AppError } from '@/utils/errors'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Order } from '@/types/order'
import { formatDate, formatPrice } from '@/utils/format'
import { OrderStatus, OrderStatusLabel, OrderStatusColor } from '@/types/order'
const orders = ref<Order[]>([])
const loading = ref(false)
const total = ref(0)

// 详情弹窗
const dialogVisible = ref(false)
const selectedOrder = ref<Order | null>(null)
const handleViewDetail = (order: Order) => {
  selectedOrder.value = order
  dialogVisible.value = true
}


// 加载订单列表
const loadOrders = async () => {
  loading.value = true
  try {
    const res = await orderApi.getMyOrders()
    console.log('getMyOrders调用成功，返回数据: ', '\n', res.data.data)
    orders.value = res.data.data
    total.value = res.data.data.length
  } catch (error) {
    if (error instanceof AppError) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('获取订单列表失败')
    }
  } finally {
    loading.value = false
  }
}

const handleCancelOrder = async (order: Order) => {
  try {
    await ElMessageBox.confirm('确定要取消该订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await orderApi.updateStatus(order.id, { status: OrderStatus.CANCELLED })
    ElMessage.success('订单已取消')
    loadOrders()
  } catch (error) {
    if (error !== 'cancel') {
      if (error instanceof AppError) {
        ElMessage.error(error.message)
      } else {
        ElMessage.error('取消订单失败')
      }
    }
  }
}
const handlePayOrder = async (order: Order) => {
  try {
    await orderApi.updateStatus(order.id, { status: OrderStatus.PAID })
    ElMessage.success('支付成功')
    loadOrders()
  } catch (error) {
    if (error instanceof AppError) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('支付失败')
    }
  }
}
onMounted(() => {
  loadOrders()
})
</script>

<template>
  <div class="container" id="container">
    <el-table :data="orders" stripe style="width: 100%" :loading="loading">
      <el-table-column show-overflow-tooltip prop="orderNo" label="订单号" width="200" />
      <el-table-column show-overflow-tooltip prop="event.title" label="活动名称" min-width="200" />
      <el-table-column show-overflow-tooltip prop="event.location" label="活动地点" min-width="200" />
      <el-table-column
        show-overflow-tooltip
        label="发起人"
        width="120"
      >
        <template #default="scope">
          {{ scope.row.event.organizer.nickname || scope.row.event.organizer.username }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="quantity" label="购买数量" width="100" />
      <el-table-column
        show-overflow-tooltip
        prop="totalAmount"
        label="总价"
        width="100"
        :formatter="(raw: any, col: any, val: string | number) => formatPrice(val)"
      />
      <el-table-column show-overflow-tooltip label="订单状态" width="100">
        <template #default="scope">
          <el-tag :type="OrderStatusColor[scope.row.status as OrderStatus]">
            {{ OrderStatusLabel[scope.row.status as OrderStatus] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="createdAt"
        label="下单时间"
        width="180"
        :formatter="( row: any, column: any, date: Date | string) => formatDate(date)"
      />
      <el-table-column label="操作" width="280">
        <template #default="scope">
          <div class="action-buttons">
            <el-button size="small" @click="handleViewDetail(scope.row)">查看详情</el-button>
            <el-button
              v-if="scope.row.status === OrderStatus.PENDING"
              size="small"
              type="danger"
              @click="handleCancelOrder(scope.row)"
            >
              取消订单
            </el-button>
            <el-button
              v-if="scope.row.status === OrderStatus.PENDING"
              size="small"
              type="primary"
              @click="handlePayOrder(scope.row)"
            >
              支付订单
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 详情弹窗 -->
    <el-dialog title="订单详情" v-model="dialogVisible" width="600px">
      <div v-if="selectedOrder" class="order-detail">
        <div class="detail-row">
          <span class="label">订单号：</span>
          <span class="value">{{ selectedOrder.orderNo }}</span>
        </div>
        <div class="detail-row">
          <span class="label">活动名称：</span>
          <span class="value">{{ selectedOrder.event.title }}</span>
        </div>
        <div class="detail-row">
          <span class="label">活动地点：</span>
          <span class="value">{{ selectedOrder.event.location }}</span>
        </div>
        <div class="detail-row">
          <span class="label">活动时间：</span>
          <span class="value"
            >{{ formatDate(selectedOrder.event.startTime) }} -
            {{ formatDate(selectedOrder.event.endTime) }}</span
          >
        </div>
        <div class="detail-row">
          <span class="label">发起人：</span>
          <span class="value">{{ selectedOrder.event.organizer.nickname }}</span>
        </div>
        <div class="detail-row">
          <span class="label">购买数量：</span>
          <span class="value">{{ selectedOrder.quantity }} 张</span>
        </div>
        <div class="detail-row">
          <span class="label">单价：</span>
          <span class="value">¥{{ selectedOrder.unitPrice }}</span>
        </div>
        <div class="detail-row">
          <span class="label">总价：</span>
          <span class="value total">¥{{ selectedOrder.totalAmount }}</span>
        </div>
        <div class="detail-row">
          <span class="label">订单状态：</span>
          <span class="value">
            <el-tag :type="OrderStatusColor[selectedOrder.status]">{{
              OrderStatusLabel[selectedOrder.status]
            }}</el-tag>
          </span>
        </div>
        <div class="detail-row">
          <span class="label">下单时间：</span>
          <span class="value">{{ formatDate(selectedOrder.createdAt) }}</span>
        </div>
        <div class="detail-row" v-if="selectedOrder.paidAt">
          <span class="label">支付时间：</span>
          <span class="value">{{ formatDate(selectedOrder.paidAt) }}</span>
        </div>
        <div class="detail-row" v-if="selectedOrder.cancelledAt">
          <span class="label">取消时间：</span>
          <span class="value">{{ formatDate(selectedOrder.cancelledAt) }}</span>
        </div>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
#container {
  padding: 20px;
}
.container {
  background-color: #fff;
}
.action-buttons {
  display: flex;
  gap: 8px;
  white-space: nowrap;
}
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
