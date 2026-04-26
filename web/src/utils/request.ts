import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { HttpError, NetworkError, ClientError } from '@/utils/errors'

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token && !config.headers?.Authorization) {
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      throw new HttpError(
        error.response.code || '500',
        error.response.data.message || '服务器内部错误',
        error.response.data,
      )
    } else if (error.request) {
      throw new NetworkError('网络异常，请检查连接', error)
    } else {
      throw new ClientError('系统错误，请联系管理员', error)
    }
  },
)

export default request
