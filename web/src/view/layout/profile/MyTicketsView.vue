<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { AppError } from '@/utils/errors'
import { formatDate, formatPrice } from '@/utils/format'
import { TicketStatus, TicketStatusLabel, TicketStatusColor } from '@/types/ticket'
import { useTicketStore } from '@/stores/ticket'

const currentPage = ref(1)
const pageSize = ref(20)
const router = useRouter()
const ticketStore = useTicketStore()
const loading = ref(false)

const filterStatus = (value: TicketStatus, row: { status: TicketStatus }) => {
  return row.status === value
}

const viewEventDetail = (eventId: string) => {
  router.push(`/events/${eventId}`)
}

async function loadTickets() {
  loading.value = true
  try {
    await ticketStore.loadTickets(pageSize.value, currentPage.value)
  } catch (error) {
    if (error instanceof AppError) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('获取票券列表失败')
    }
  } finally {
    loading.value = false
  }
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  loadTickets()
}

onMounted(() => {
  loadTickets()
})
</script>

<template>
  <div class="container">
    <el-table v-if="ticketStore.total > 0" :data="ticketStore.tickets" stripe :loading="loading" fit>
      <el-table-column show-overflow-tooltip prop="ticketNo" label="票券编号" width="200" />
      <el-table-column show-overflow-tooltip label="活动名称" min-width="200">
        <template #default="scope">
          <span class="event-link" @click="viewEventDetail(scope.row.event.id)">
            {{ scope.row.event.title }}
          </span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="event.location" label="活动地点" min-width="200" />
      <el-table-column show-overflow-tooltip label="活动时间" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.event.startTime) }}
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="event.price"
        label="票价"
        width="100"
        :formatter="(raw: any, col: any, val: string | number) => formatPrice(val)"
      />
      <el-table-column
        show-overflow-tooltip
        :filters="[
          { text: '未使用', value: TicketStatus.UNUSED },
          { text: '已使用', value: TicketStatus.USED },
          { text: '已取消', value: TicketStatus.CANCELLED },
          { text: '已退款', value: TicketStatus.REFUNDED },
        ]"
        :filter-method="filterStatus"
        label="票券状态"
        width="100"
      >
        <template #default="scope">
          <el-tag :type="TicketStatusColor[scope.row.status as TicketStatus]">
            {{ TicketStatusLabel[scope.row.status as TicketStatus] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="createdAt"
        label="购买时间"
        width="180"
        sortable
        :formatter="(row: any, column: any, date: Date | string) => formatDate(date)"
      />
      <el-table-column show-overflow-tooltip prop="order.orderNo" label="关联订单" width="200" />
    </el-table>
    <el-empty v-else description="暂无票券，快去购买一张票吧~" />
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        background
        layout="prev, pager, next, jumper"
        :total="ticketStore.total"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.event-link {
  cursor: pointer;
}

.event-link:hover {
  color: #409eff;
  text-decoration: underline;
}

.pagination-container {
  margin: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
