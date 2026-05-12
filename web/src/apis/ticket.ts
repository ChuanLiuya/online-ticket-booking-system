import type { AxiosResponse } from 'axios';
import request from '@/utils/request';
import type { Response } from '@/types/respones';
import type { Ticket, CreateTicketReqBody } from '@/types/ticket';



export const ticketApi = {
  create: async (data: CreateTicketReqBody): Promise<AxiosResponse<Response<Ticket>>> => {
    return await request.post('/tickets', data);
  },
  getMyTickets: async (limit: number = 20, page: number = 1): Promise<AxiosResponse<Response<{ total: number; tickets: Ticket[] }>>> => {
    return await request.get('/tickets/my', { params: { limit, page } });
  },
};
