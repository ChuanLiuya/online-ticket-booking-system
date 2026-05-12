import { orderApi } from '@/apis/order'
import { OrderStatus, type Order } from '@/types/order'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOrderStore = defineStore('order', () => {
  const orderTotal = ref(0)
  const orders = ref<Order[]>([])
  const selectedOrder = ref<Order | null>(null)
  /**
   * 订单支付是否在轮询状态
   */
  const isCheckingPaymentStatus = ref(false)
  /**
   * 订单支付状态轮询定时器
   */
  let checkPaymentStatusInterval: ReturnType<typeof setInterval> | null = null
  /**
   * 订单支付状态轮询
   */
  function startCheckPaymentStatus(orderId: string) {
    console.log('开始轮询订单状态', orderId)
    stopCheckPaymentStatus()
    isCheckingPaymentStatus.value = true

    checkPaymentStatusInterval = setInterval(async () => {
      try {
        console.log('轮询订单状态', orderId)
        const res = await orderApi.getOrderDetail(orderId)
        const updatedOrder = res.data.data
        if (
          updatedOrder.status === OrderStatus.PAID ||
          updatedOrder.status === OrderStatus.CANCELLED
        ) {
          stopCheckPaymentStatus()
        }
      } catch (error) {
        console.error('轮询订单状态失败:', error)
        stopCheckPaymentStatus()
      }
    }, 1000)
  }
  /**
   * 停止轮询订单状态
   */
  function stopCheckPaymentStatus() {
    if (checkPaymentStatusInterval) {
      clearInterval(checkPaymentStatusInterval)
      checkPaymentStatusInterval = null
    }
    isCheckingPaymentStatus.value = false
    loadOrders()
    console.log('轮询订单状态已停止')
  }

  function setSelectedOrder(order: Order | null) {
    selectedOrder.value = order
  }

  async function loadOrders() {
    const res = await orderApi.getMyOrders()
    console.log('加载用户的订单列表成功', res)
    orders.value = res.data.data.orders
    orderTotal.value = res.data.data.total
  }

  async function cancelOrder(order: Order) {
    await orderApi.updateStatus(order.id, {
      status: OrderStatus.CANCELLED,
    })
    loadOrders()
  }

  async function createPayment(orderId: string) {
    try {
      const res = await orderApi.createPayment(orderId, {
        paymentMethod: 'mock',
      })
      console.log('创建支付请求成功', res.data.data.message)
      startCheckPaymentStatus(orderId)
    } catch (error) {
      console.error('创建支付请求失败:', error)
      throw error
    }
  }

  return {
    orderTotal,
    orders,
    selectedOrder,
    isCheckingPaymentStatus,
    setSelectedOrder,
    loadOrders,
    cancelOrder,
    createPayment,
  }
})
