import type { LoginReqBody, LoginRespBody } from '@/types/user'
import request from '@/utils/request'
import type { AxiosResponse } from 'axios';
import type { Response } from '@/types/respones';

export const authApi = {
  login: async (data: LoginReqBody): Promise<AxiosResponse<Response<LoginRespBody>>> => {
    return await request.post('/auth/login', data)
  },
}
