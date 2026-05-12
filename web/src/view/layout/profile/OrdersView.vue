<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { AppError } from '@/utils/errors'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Order } from '@/types/order'
import { formatDate, formatPrice } from '@/utils/format'
import { OrderStatus, OrderStatusLabel, OrderStatusColor } from '@/types/order'
import MyOrderDialog from '@/components/myComponents/MyOrderDialog.vue'
import { useOrderStore } from '@/stores/order'

const orderStore = useOrderStore()
const router = useRouter()
const loading = ref(false)

const dialogVisible = ref(false)
const handleViewDetail = (order: Order) => {
  orderStore.setSelectedOrder(order)
  dialogVisible.value = true
}

// 加载订单列表
const loadOrders = async () => {
  loading.value = true
  try {
    await orderStore.loadOrders()
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
    await orderStore.cancelOrder(order)
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
const handleCreatePaymentClick = async (order: Order) => {
  try {
    await orderStore.createPayment(order.id)
    ElMessage.success('创建支付请求成功')
    loadOrders()
  } catch (error) {
    if (error instanceof AppError) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('创建支付请求失败')
    }
  }
}
// const searchText = ref('')
onMounted(() => {
  loadOrders()
})
const filterStatus = (value: OrderStatus, row: Order) => {
  console.log('filterStatus', value, row)
  return row.status === value
}
</script>

<template>
  <div class="container" id="container">
    <el-table v-if="orderStore.orders.length > 0" :data="orderStore.orders" stripe style="width: 100%" :loading="loading" fit>
      <el-table-column show-overflow-tooltip prop="orderNo" label="订单号" width="200" />
      <el-table-column show-overflow-tooltip label="活动名称" min-width="200">
        <template #default="scope">
          <span class="event-link" @click="router.push(`/events/${scope.row.event.id}`)">
            {{ scope.row.event.title }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="event.location"
        label="活动地点"
        min-width="200"
      />
      <el-table-column show-overflow-tooltip label="发起人" width="120">
        <template #default="scope">
          {{ scope.row.event.organizer.nickname || scope.row.event.organizer.username }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="quantity" label="购买数量" width="100" />
      <el-table-column
        show-overflow-tooltip
        prop="totalAmount"
        label="总价"
        sortable
        width="100"
        :formatter="(raw: any, col: any, val: string | number) => formatPrice(val)"
      />
      <el-table-column
        show-overflow-tooltip
        :filters="[
          { text: '待支付', value: OrderStatus.PENDING },
          { text: '已支付', value: OrderStatus.PAID },
          { text: '已取消', value: OrderStatus.CANCELLED },
          { text: '已完成', value: OrderStatus.COMPLETED },
          { text: '已退款', value: OrderStatus.REFUNDED },
        ]"
        :filter-method="filterStatus"
        label="订单状态"
        width="100"
      >
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
        sortable
        :formatter="(row: any, column: any, date: Date | string) => formatDate(date)"
      />
      <el-table-column label="操作" width="280" fixed="right">
        <!-- <template #header>
          <el-input v-model="searchText" size="small" placeholder="搜索订单" />
        </template> -->
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
              @click="handleCreatePaymentClick(scope.row)"
            >
              支付订单
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-empty v-else description="暂无订单" />
    <MyOrderDialog v-model="dialogVisible" :order="orderStore.selectedOrder" />
  </div>
</template>

<style scoped>
.container {
  background-color: #fff;
}
.action-buttons {
  display: flex;
  gap: 8px;
  white-space: nowrap;
}
.event-link {
  cursor: pointer;
}
.event-link:hover {
  color: #409eff;
  text-decoration: underline;
}
</style>
