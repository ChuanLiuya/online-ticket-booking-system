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
