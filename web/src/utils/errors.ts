// 基础抽象类（所有自定义错误的父类）
export class AppError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, cause || undefined)
    this.name = this.constructor.name
  }
}

// HTTP 错误
export class HttpError extends AppError {
  code: string
  data: object | null
  constructor(code: string, message: string, data?: object) {
    super(message)
    this.code = code
    this.data = data || null
  }
}

// 用于表示网络层的错误
export class NetworkError extends AppError {
  constructor(message: string = '网络连接失败，请稍后重试', cause?: unknown) {
    super(message, cause || undefined)
  }
}

// 客户端错误：前端代码 Bug
export class ClientError extends AppError {
  constructor(message: string = '系统错误，请联系管理员', cause?: unknown) {
    super(message, cause || undefined)
  }
}
