<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { orderApi } from '@/apis/order'

const router = useRouter()
import { AppError } from '@/utils/errors'
import { ElMessage } from 'element-plus'
import type { Order } from '@/types/order'
import { formatDate, formatDuration, formatPrice } from '@/utils/format'
import { OrderStatus } from '@/types/order'
import { EventStatus, EventStatusLabel, EventStatusColor } from '@/types/event'
const orders = ref<Order[]>([])
const loading = ref(false)

const joinedEvents = computed(() => {
  return orders.value
    .filter(order => order.status === OrderStatus.PAID || order.status === OrderStatus.COMPLETED)
    .map(order => order.event)
})
const loadOrders = async () => {
  loading.value = true
  try {
    const res = await orderApi.getMyOrders()
    console.log('getMyOrders调用成功，返回数据: ', '\n', res.data.data)
    orders.value = res.data.data
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

const filterStatus = (value: EventStatus, row: { status: EventStatus }) => {
  return row.status === value
}

onMounted(() => {
  loadOrders()
})
</script>

<template>
  <div class="container">
    <el-table v-if="joinedEvents.length > 0" :data="joinedEvents" stripe style="width: 100%" :loading="loading" fit>
      <el-table-column show-overflow-tooltip label="活动名称">
        <template #default="scope">
          <span class="event-link" @click="router.push(`/events/${scope.row.id}`)">
            {{ scope.row.title }}
          </span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="location" label="活动地点"  />
      <el-table-column show-overflow-tooltip label="发起人" width="120">
        <template #default="scope">
          {{ scope.row.organizer.nickname || scope.row.organizer.username }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="startTime" sortable label="开始时间" :formatter="(raw: any, col: any, val: any) => formatDate(val)" />
      <el-table-column show-overflow-tooltip label="持续时间" min-width="120" >
        <template #default="scope">
          {{ formatDuration(scope.row.startTime, scope.row.endTime) }}
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="price"
        label="价格"
        width="100"
        sortable
        :formatter="(raw: any, col: any, val: string | number) => formatPrice(val)"
      />

      <el-table-column show-overflow-tooltip prop="currentParticipants" sortable label="参与人数" width="120">
        <template #default="scope">
          {{ scope.row.currentParticipants }}/{{ scope.row.maxParticipants }}
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        :filters="[
          { text: '即将开始', value: EventStatus.UPCOMING },
          { text: '进行中', value: EventStatus.ONGOING },
          { text: '已完成', value: EventStatus.COMPLETED },
          { text: '已取消', value: EventStatus.CANCELED },
        ]"
        :filter-method="filterStatus"
        label="活动状态"
        width="100"
        fixed="right"
      >
        <template #default="scope">
          <el-tag :type="EventStatusColor[scope.row.status as EventStatus]">
            {{ EventStatusLabel[scope.row.status as EventStatus] }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-empty v-else description="暂无参加的活动，快去探索精彩活动吧~" />
  </div>
</template>

<style scoped>
.container {
  background-color: #fff;
}

.event-image {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}
.event-link {
  cursor: pointer;
}
.event-link:hover {
  color: #409eff;
  text-decoration: underline;
}
</style>
