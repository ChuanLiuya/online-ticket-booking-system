<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { formatDate, formatDuration, formatPrice } from '@/utils/format'
import { EventStatus, EventStatusLabel, EventStatusColor } from '@/types/event'
import { useOrderStore } from '@/stores/order'

const router = useRouter()
const orderStore = useOrderStore()
const loading = ref(false)

const filterStatus = (value: EventStatus, row: { status: EventStatus }) => {
  return row.status === value
}

onMounted(() => {
  orderStore.loadOrders()
})
</script>

<template>
  <div class="container">
    <el-table
      v-if="orderStore.eventTotal > 0"
      :data="orderStore.joinedEvents"
      stripe
      style="width: 100%"
      :loading="loading"
      fit
    >
      <el-table-column show-overflow-tooltip label="活动名称">
        <template #default="scope">
          <span class="event-link" @click="router.push(`/events/${scope.row.id}`)">
            {{ scope.row.title }}
          </span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="location" label="活动地点" />
      <el-table-column show-overflow-tooltip label="发起人" width="120">
        <template #default="scope">
          {{ scope.row.organizer.nickname || scope.row.organizer.username }}
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="startTime"
        sortable
        label="开始时间"
        :formatter="(raw: any, col: any, val: any) => formatDate(val)"
        width="150"
      />
      <el-table-column show-overflow-tooltip label="持续时间" width="auto">
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

      <el-table-column
        show-overflow-tooltip
        prop="currentParticipants"
        sortable
        label="参与人数"
        width="120"
      >
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
