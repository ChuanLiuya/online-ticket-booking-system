<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useOrderStore } from '@/stores/order'
const orderStore = useOrderStore()
const route = useRoute()
const orderId = route.params.orderId
onMounted(async () => {
  await orderStore.setSelectedOrder(orderId as string)
})
</script>

<template>
  <div class="container" id="container">
    <div>订单详情：{{ orderStore.selectedOrder?.orderNo }}</div>
  </div>
</template>

<style scoped>
#container {
  padding: 20px;
}
</style>
