import { eventApi } from '@/apis/event'
import type { Event, updateEventReqBody } from '@/types/event'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMyEventsStore = defineStore('myEvents', () => {
  const myEvents = ref<Event[]>([])
  const total = ref(0)
  const isLoadingMyEvents = ref(false)

  /**
   * 加载用户组织的活动列表
   * @param limit 每页数量
   * @param page 当前页码
   */
  async function loadMyEvents(limit: number = 20, page: number = 1) {
    isLoadingMyEvents.value = true
    try {
      const res = await eventApi.findMyEvents(limit, page)
      console.log('获取用户的活动列表成功', res)
      myEvents.value = res.data.data.events
      total.value = res.data.data.total
    } finally {
      isLoadingMyEvents.value = false
    }
  }

  /**
   * 更新活动信息
   * @param eventId 活动ID
   * @param updatedEvent 提交的更新信息
   * @returns 更新后的活动信息
   */
  async function updateMyEventById(eventId: string, updatedEvent: updateEventReqBody) {
    const res = await eventApi.update(eventId, updatedEvent)
    return res.data.data
  }

  return {
    myEvents,
    total,
    isLoadingMyEvents,
    loadMyEvents,
    updateMyEventById,
  }
})
