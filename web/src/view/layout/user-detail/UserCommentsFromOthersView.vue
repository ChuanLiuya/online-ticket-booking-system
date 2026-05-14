<template>
  <div class="container" id="container">
    <div class="title">收到的评论</div>



  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCommentActions } from '@/composables/useCommentActions'
import type { Comment } from '@/types/comment'
import { AppError } from '@/utils/errors'
import { ElMessage } from 'element-plus'
const route = useRoute()
const userId = route.params.userId as string
// 使用评论组合式函数
const CommentsActions = useCommentActions()


const comments = ref<Comment[]>([])
const directCommentsTotal = ref<number>(0)
const currentPage = ref<number>(1)
const limit = ref<number>(20)

// 初始化
onMounted(async () => {
  try {
    const res = await CommentsActions.loadDirectComments(userId, 'user', currentPage.value, limit.value)
    comments.value = res.comments
    directCommentsTotal.value = res.total
  } catch (error) {
    if (error instanceof AppError) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('加载评论失败')
    }
  }
})
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.avatar-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  &.small {
    width: 32px;
    height: 32px;
  }
}

.avatar {
  color: #fff;
  font-size: 16px;
  font-weight: bold;

  .small & {
    font-size: 12px;
  }
}

.user-info {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 600;
  color: #333;
}

.time {
  font-size: 12px;
  color: #999;
}

.comment-content {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  margin-bottom: 12px;
}

.comment-actions {
  display: flex;
  gap: 16px;
}

.action-btn {
  background: none;
  border: none;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: #f5f5f5;
    color: #333;
  }
}

.replies-container {
  margin-top: 16px;
  padding-left: 52px;
  border-top: 1px solid #eee;
  padding-top: 16px;
}

.reply-item {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.reply-content {
  font-size: 13px;
  color: #444;
  line-height: 1.5;
  margin-bottom: 8px;
}

.reply-actions {
  display: flex;
  gap: 12px;
}

.load-more {
  text-align: center;
  margin-top: 20px;
}

.load-more button {
  background: #fff;
  border: 1px solid #ddd;
  padding: 10px 24px;
  border-radius: 20px;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
    border-color: #ccc;
  }
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 14px;
}
</style>
