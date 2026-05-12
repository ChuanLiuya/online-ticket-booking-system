import { ref } from 'vue'
import { eventApi } from '@/apis/event'

export function useEventActions() {
  const loading = ref(false)

  async function findEventById(id: string) {
    const res = await eventApi.findOne(id)
    return res.data.data
  }

  return { findEventById, loading }
}
