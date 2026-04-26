import { BadRequestException, ValidationPipe } from '@nestjs/common';

// 这个管道让 NestJS 在接收请求时：只保留 DTO 定义过的字段、自动转换类型、遇到第一个错误就停止验证，并返回一句简明的中文错误提示。
export class GlobalValidatePipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true, // 自动移除未定义的属性
      stopAtFirstError: true, // 遇到第一个错误立即停止
      transform: true, // 自动转换为指定类型
      exceptionFactory: (errors) => {
        const error = errors[0];
        const constraints = error.constraints || {};
        const message = Object.values(constraints).join(', ') || '请求配置错误';
        return new BadRequestException(message);
      },
    });
  }
}
