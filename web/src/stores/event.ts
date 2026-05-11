import { eventApi } from '@/apis/event'
import type { Event } from '@/types/event'
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


  // function updateEvent(updatedEvent: Event) {

  // }

  // function removeEvent(eventId: string) {
  // }

  return {
    events,
    total,
    loading,
    loadMyEvents,
  }
})
