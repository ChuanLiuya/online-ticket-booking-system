<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { AppError } from '@/utils/errors'
import { formatDate, formatDuration, formatPrice } from '@/utils/format'
import { EventStatus, EventStatusLabel, EventStatusColor } from '@/types/event'
import { useEventStore } from '@/stores/event'
import type { Event } from '@/types/event'
import MyEventDialog from '@/components/myComponents/MyEventDialog.vue'

const router = useRouter()
const eventStore = useEventStore()
const loading = ref(false)
const dialogVisible = ref(false)
const selectedEvent = ref<Event | null>(null)

const filterStatus = (value: EventStatus, row: { status: EventStatus }) => {
  return row.status === value
}

const viewDetail = (event: Event) => {
  selectedEvent.value = event
  dialogVisible.value = true
}

const handleEditButtonClick = (event: Event) => {
  router.push(`/edit-event/${event.id}`)
}

async function loadEvents() {
  loading.value = true
  try {
    await eventStore.loadMyEvents()
  } catch (error) {
    if (error instanceof AppError) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('获取活动列表失败')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadEvents()
})
</script>

<template>
  <div class="container">

      <el-table
        v-if="eventStore.total > 0"
        :data="eventStore.events"
        stripe
        :loading="loading"
        fit
      >
        <el-table-column show-overflow-tooltip label="活动名称" min-width="200">
          <template #default="scope">
            <span class="event-link" @click="router.push(`/events/${scope.row.id}`)">
              {{ scope.row.title }}
            </span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="location" label="活动地点" min-width="200" />
        <el-table-column show-overflow-tooltip prop="description" label="活动描述" min-width="200" />
        <el-table-column
          show-overflow-tooltip
          prop="startTime"
          sortable
          label="开始时间"
          width="180"
          :formatter="(raw: any, col: any, val: any) => formatDate(val)"
        />
        <el-table-column show-overflow-tooltip label="持续时间">
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
        >
          <template #default="scope">
            <el-tag :type="EventStatusColor[scope.row.status as EventStatus]">
              {{ EventStatusLabel[scope.row.status as EventStatus] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="操作" width="160" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="viewDetail(scope.row)">查看详情</el-button>
            <el-button size="small" type="primary" @click="handleEditButtonClick(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-else description="暂无活动，快去创建一个活动吧~" />
    </div>

    <MyEventDialog :event="selectedEvent" v-model="dialogVisible" />
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
</style>
