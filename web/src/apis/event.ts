import type { AxiosResponse } from 'axios'
import request from '@/utils/request'
import type { Response } from '@/types/respones'

import type { createEventReqBody, Event } from '@/types/event'



export const eventApi = {
  create: async (data: createEventReqBody): Promise<AxiosResponse<Response<Event>>> => {
    return await request.post('/events', data)
  },
}
