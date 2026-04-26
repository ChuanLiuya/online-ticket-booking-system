export class ApiResponseDto<T> {
  message: string;
  data: T | null;
  constructor(message: string, data?: T) {
    this.message = message;
    this.data = data || null;
  }
}
