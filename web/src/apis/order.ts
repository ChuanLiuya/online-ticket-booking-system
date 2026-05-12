import type { AxiosResponse } from 'axios';
import request from '@/utils/request';
import type { Response } from '@/types/respones';
import type { Order, CreateOrderReqBody, UpdateOrderStatusReqBody } from '@/types/order';

export const orderApi = {
  create: async (data: CreateOrderReqBody): Promise<AxiosResponse<Response<Order>>> => {
    return await request.post('/orders', data);
  },

  getMyOrders: async (limit: number = 20, page: number = 1): Promise<AxiosResponse<Response<{ total: number; orders: Order[] }>>> => {
    return await request.get('/orders/my', { params: { limit, page } });
  },

  getOrderDetail: async (id: string): Promise<AxiosResponse<Response<Order>>> => {
    return await request.get(`/orders/${id}`);
  },

  updateStatus: async (id: string, data: UpdateOrderStatusReqBody): Promise<AxiosResponse<Response<Order>>> => {
    return await request.patch(`/orders/${id}/status`, data);
  },
};
