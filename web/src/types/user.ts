// 用户类型定义
export interface User {
  id: string
  username: string
  email: string
  phone?: string
  nickname?: string
  role: string
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}

// 注册请求体
export interface RegisterReqBody {
  username: string
  email: string
  password: string
}

// 登录请求体
export interface LoginReqBody {
  username: string
  password: string
}

export interface LoginRespBody {
  access_token: string
  user: User
}
