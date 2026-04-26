import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponseDto } from '../dto/api-response.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    let responseBody: ApiResponseDto<any>;
    let httpStatus: HttpStatus;

    // 处理http异常
    if (exception instanceof HttpException) {
      responseBody = new ApiResponseDto(exception.message);
      httpStatus = exception.getStatus();
    } else {
      // 处理其他异常
      responseBody = new ApiResponseDto('系统内部错误');
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    // 发送响应
    response.status(httpStatus).json(responseBody);
  }
}
