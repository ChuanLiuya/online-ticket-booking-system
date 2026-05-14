import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type { Response } from '@/types/respones'
import type { Comment } from '@/types/comment'

export const commentApi = {
  // 获取一级评论
  getDirectComments: async (targetId: string, targetType: string, page: number = 1, limit: number = 20): Promise<AxiosResponse<Response<{ total: number; comments: Comment[] }>>> => {
    return await request.get(`/comments/direct`, {
      params: {
        targetId,
        targetType,
        page,
        limit
      }
    })
  },

  // // 获取某评论的嵌套回复（二三级评论）
  // getNestedReplies: async (rootCommentId: string, page: number = 1, limit: number = 20): Promise<AxiosResponse<Response<GetCommentsResponse>>> => {
  //   return await request.get(`/comments/nested-replies/${rootCommentId}`, {
  //     params: {
  //       page,
  //       limit
  //     }
  //   })
  // },

  // // 获取某评论下的对话
  // getConversation: async (parentCommentId: string, page: number = 1, limit: number = 20): Promise<AxiosResponse<Response<GetCommentsResponse>>> => {
  //   return await request.get(`/comments/conversation/${parentCommentId}`, {
  //     params: {
  //       page,
  //       limit
  //     }
  //   })
  // }
}
