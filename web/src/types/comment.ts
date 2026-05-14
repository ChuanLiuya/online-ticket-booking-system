import type { User } from "./user"

// 评论类型定义
export interface Comment {
  id: string
  targetId: string
  targetType: 'event' | 'user' | 'order'
  userId: string
  content: string
  parentId: string | null
  rootId: string | null
  likeCount: number
  replyCount: number
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
  user: User
}
