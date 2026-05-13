import type { RegisterReqBody, User } from '@/types/user'
import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type { Response } from '@/types/respones'

export const userApi = {
  register: async (data: RegisterReqBody) => {
    return await request.post('/users', data)
  },
  getMe: async (): Promise<AxiosResponse<Response<User>>> => {
    return await request.get('/users/me')
  },
  getEventsByOrganizerId: async (organizerId: string,{page = 1,limit = 20}: {page: number, limit: number}): Promise<AxiosResponse<Response<{total: number, events: Event[]}>>> => {
    return await request.get(`/users/${organizerId}/events`,{params: {page,limit}})
  },
  getUserInfoById: async (userId: string): Promise<AxiosResponse<Response<User>>> => {
    return await request.get(`/users/${userId}`)
  }
}
