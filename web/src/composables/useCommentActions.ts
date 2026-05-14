import { ref } from 'vue'
import { commentApi } from '@/apis/comment'
import type { Comment } from '@/types/comment'

export function useCommentActions() {
  const isLoadingDirectComments = ref(false)
  // // 切换展开/收起回复
  // const toggleReplies = async (comment: Comment) => {
  //   const index = expandedComments.value.indexOf(comment.id)
  //   if (index > -1) {
  //     expandedComments.value.splice(index, 1)
  //   } else {
  //     expandedComments.value.push(comment.id)
  //     // 如果还没加载过这个评论的回复，就去加载
  //     if (!allReplies.value.some(r => r.rootId === comment.id)) {
  //       await loadReplies(comment.id)
  //     }
  //   }
  // }

  // 加载评论列表
  async function loadDirectComments(
    targetId: string,
    targetType: string = 'user',
    page?: number,
    limit?: number,
  ): Promise<{ total: number; comments: Comment[] }> {
    isLoadingDirectComments.value = true

    try {
      const res = await commentApi.getDirectComments(targetId, targetType, page || 1, limit || 20)
      console.log('加载用户的其他用户的直接评论成功', res)
      return res.data.data
    } finally {
      isLoadingDirectComments.value = false
    }
  }

  return {
    loadDirectComments,
    isLoadingDirectComments,
  }
}
