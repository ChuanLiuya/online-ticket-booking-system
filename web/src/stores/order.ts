import { orderApi } from "@/apis/order";
import { OrderStatus, type Order } from "@/types/order";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useOrderStore = defineStore('order', () => {
  const total = ref(0)
  const orders = ref<Order[]>([])
  const selectedOrder = ref<Order | null>(null)

  function setSelectedOrder(order: Order | null) {
    selectedOrder.value = order
  }
  /**
   * 加载用户订单列表
   */
  async function loadOrders() {
    const res = await orderApi.getMyOrders()
    orders.value = res.data.data
    total.value = res.data.data.length
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


  return { orders, selectedOrder, setSelectedOrder, loadOrders, cancelOrder, payOrder }
})

