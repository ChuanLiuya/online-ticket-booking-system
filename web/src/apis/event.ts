import type { AxiosResponse } from 'axios'
import request from '@/utils/request'
import type { Response } from '@/types/respones'

import type { createEventReqBody, Event } from '@/types/event'



export const eventApi = {
  create: async (data: createEventReqBody): Promise<AxiosResponse<Response<Event>>> => {
    return await request.post('/events', data)
  },
  findHot: async (limit: number = 20, page: number = 1): Promise<AxiosResponse<Response<Event[]>>> => {
    return await request.get('/events/hot', { params: { limit, page } })
  },
  findOne: async (id: string): Promise<AxiosResponse<Response<Event>>> => {
    return await request.get(`/events/${id}`)
  },
  countHot: async (): Promise<AxiosResponse<Response<number>>> => {
    return await request.get('/events/hot/count')
  },
}
