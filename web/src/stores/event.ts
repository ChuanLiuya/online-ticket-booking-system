import { eventApi } from '@/apis/event'
import type { Event, updateEventReqBody } from '@/types/event'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEventStore = defineStore('event', () => {
  const events = ref<Event[]>([])
  const total = ref(0)
  const loading = ref(false)

  async function loadMyEvents() {
    loading.value = true
    try {
      const res = await eventApi.findMyEvents()
      events.value = res.data.data
      total.value = res.data.data.length
    } finally {
      loading.value = false
    }
  }

  async function findEvent(id: string) {
    const res = await eventApi.findOne(id)
    return res.data.data
  }
  /**
   * 更新活动信息
   * @param eventId 活动ID
   * @param updatedEvent 提交的更新信息
   * @returns 更新后的活动信息
   */
  async function updateEvent(eventId: string, updatedEvent: updateEventReqBody) {
    const res = await eventApi.update(eventId, updatedEvent)
    return res.data.data
  }

  return {
    events,
    total,
    loading,
    loadMyEvents,
    findEvent,
    updateEvent,
  }
})
