<script setup lang="ts">
import { onMounted } from 'vue'
import { useTicketStore } from '@/stores/ticket'


const ticketStore = useTicketStore()


onMounted(() => {
  ticketStore.loadTickets()
})
</script>

<template>
  <div class="container">
    <div class="header">
      <h2>我的票券</h2>
    </div>
  </div>
</template>

<style scoped>
.container {
  background-color: #fff;
}

</style>
