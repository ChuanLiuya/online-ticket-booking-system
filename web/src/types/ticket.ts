import type { Order } from './order'
import type { User } from './user'
import type { Event } from './event'

/**
 * 票状态枚举
 */
export enum TicketStatus {
  /**
   * 未使用
   */
  UNUSED = 'unused',
  /**
   * 已使用
   */
  USED = 'used',
  /**
   * 已取消
   */
  CANCELLED = 'cancelled',
  /**
   * 已退款
   */
  REFUNDED = 'refunded',
}

/**
 * 票接口
 */
export interface Ticket {
  id: string
  ticketNo: string
  event: Event
  order: Order
  user: User
  status: TicketStatus
  usedAt?: Date
  cancelledAt?: Date
  refundedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface CreateTicketReqBody {
  eventId: string
  orderId: string
}
