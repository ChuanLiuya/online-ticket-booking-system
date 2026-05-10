import type { Event } from "./event";
import type { User } from "./user";

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  COMPLETED = 'completed',
}

export interface Order {
  id: string;
  orderNo: string;
  user: User;
  event: Event;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod?: string;
  transactionId?: string;
  paidAt?: Date;
  cancelledAt?: Date;
  refundedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderReqBody {
  eventId: string;
  quantity?: number;
}

export interface UpdateOrderStatusReqBody {
  status: OrderStatus;
  transactionId?: string;
}

export const OrderStatusLabel: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: '待支付',
  [OrderStatus.PAID]: '已支付',
  [OrderStatus.CANCELLED]: '已取消',
  [OrderStatus.REFUNDED]: '已退款',
  [OrderStatus.COMPLETED]: '已完成',
};

export type TagType = 'primary' | 'success' | 'warning' | 'danger' | 'info';

export const OrderStatusColor: Record<OrderStatus, TagType> = {
  [OrderStatus.PENDING]: 'warning',
  [OrderStatus.PAID]: 'success',
  [OrderStatus.CANCELLED]: 'danger',
  [OrderStatus.REFUNDED]: 'info',
  [OrderStatus.COMPLETED]: 'primary',
};
