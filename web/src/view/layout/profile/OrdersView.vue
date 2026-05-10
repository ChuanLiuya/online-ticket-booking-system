<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { orderApi } from '@/apis/order'
import { AppError } from '@/utils/errors'
import { ElMessage } from 'element-plus'
import type { Order } from '@/types/order'
import { formatDate } from '@/utils/format'

const orders = ref<Order[]>([])
const formatOrders = computed(() =>
  orders.value.map((order) => ({
    ...order,
    createdAt: formatDate(order.createdAt),
  })),
)
const loading = ref(false)
const total = ref(0)

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

onMounted(() => {
  loadOrders()
})

// const test = [
//   {
//     createdAt: new Date(),
//     event: {
//       organizer: {
//         nickname: 'tesassssssssssssssssssssssst',
//       },
//     },
//     address: 'test',
//   },
// ]
</script>

<template>
  <div class="container" id="container">
    <el-table :data="formatOrders" stripe style="width: 100%">
      <el-table-column show-overflow-tooltip prop="createdAt" label="下单时间" width="180" />
      <el-table-column
        show-overflow-tooltip
        prop="event.organizer.nickname"
        label="发起人"
        width="180"
      />
      <el-table-column show-overflow-tooltip prop="address" label="Address" />
    </el-table>
  </div>
</template>

<style scoped>
#container {
  padding: 20px;
}
.container {
  background-color: aqua;
}
</style>
