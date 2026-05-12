import { ticketApi } from '@/apis/ticket'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type Ticket } from '@/types/ticket'

export const useTicketStore = defineStore('ticket', () => {
  const tickets = ref<Ticket[]>([])
  const total = ref(0)

  async function loadTickets(limit: number = 20, page: number = 1) {
    const res = await ticketApi.getMyTickets(limit, page)
    console.log('加载用户的票券列表成功', res)
    tickets.value = res.data.data.tickets
    total.value = res.data.data.total
  }

  return { tickets, total, loadTickets }
})
