import type { RegisterReqBody } from '@/types/user'
import request from '@/utils/request'

export const userApi = {
  register: async (data: RegisterReqBody) => {
    return await request.post('/users', data)
  },
}
