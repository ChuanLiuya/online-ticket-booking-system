import { orderApi } from '@/apis/order'
import { OrderStatus, type Order } from '@/types/order'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useOrderStore = defineStore('order', () => {
  /**
   * 用户的订单总数
   */
  const orderTotal = ref(0)
  /**
   * 用户的订单列表
   */
  const orders = ref<Order[]>([])
  /**
   * 用户已参加活动总数
   */
  const eventTotal = ref(0)
  /**
   * 用户已参加活动列表
   */
  const joinedEvents = computed(() => {
    return orders.value
      .filter(
        (order) => order.status === OrderStatus.PAID || order.status === OrderStatus.COMPLETED,
      )
      .map((order) => order.event)
  })
  /**
   * 当前选中的订单，用于显示订单详情
   */
  const selectedOrder = ref<Order | null>(null)
  /**
   * 设置当前选中的订单
   * @param order 订单
   */
  function setSelectedOrder(order: Order | null) {
    selectedOrder.value = order
  }
  /**
   * 加载用户订单列表
   */
  async function loadOrders() {
    const res = await orderApi.getMyOrders()
    console.log('加载用户的订单列表成功', res)
    orders.value = res.data.data.orders
    orderTotal.value = res.data.data.total
    eventTotal.value = joinedEvents.value.length
  }
  /**
   * 取消订单
   * @param order 订单
   */
  async function cancelOrder(order: Order) {
    await orderApi.updateStatus(order.id, {
      status: OrderStatus.CANCELLED,
    })
    loadOrders()
  }
  /**
   * 支付订单
   * @param order 订单
   */
  async function payOrder(order: Order) {
    await orderApi.updateStatus(order.id, {
      status: OrderStatus.PAID,
    })
    loadOrders()
  }
  return { orderTotal, eventTotal, orders, joinedEvents, selectedOrder, setSelectedOrder, loadOrders, cancelOrder, payOrder }
})
