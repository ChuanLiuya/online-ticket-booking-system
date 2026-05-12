import { orderApi } from '@/apis/order'
import { OrderStatus, type Order } from '@/types/order'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useTicketStore = defineStore('ticket', () => {
  const tickets = ref<Order[]>([])
  const ticketTotal = ref(0)

  const myTickets = computed(() => {
    return tickets.value
      .filter(
        (order) => order.status === OrderStatus.PAID || order.status === OrderStatus.COMPLETED,
      )
      .map((order) => order.event)
  })

  async function loadTickets() {
    const res = await orderApi.getMyOrders()
    console.log('加载用户的票券列表成功', res)
    tickets.value = res.data.data.orders
    ticketTotal.value = myTickets.value.length
  }

  return { tickets, ticketTotal, myTickets, loadTickets }
})