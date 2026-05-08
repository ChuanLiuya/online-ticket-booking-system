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
}
