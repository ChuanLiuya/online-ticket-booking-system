<script setup lang="ts">
import { useRoute } from 'vue-router'
import MyEventsTable from '@/components/myComponents/MyEventsTable.vue'

const route = useRoute()
const userId = route.params.id as string
</script>

<template>
  <MyEventsTable :user-id="userId" />
</template>
