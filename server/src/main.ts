import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalResponseInterceptor } from './common/interceptors/global-response.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { GlobalValidatePipe } from './common/pipes/global-validate.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 全局验证管道
  app.useGlobalPipes(new GlobalValidatePipe());
  // 全局异常过滤器
  app.useGlobalFilters(new GlobalExceptionFilter());
  // 全局响应拦截器
  app.useGlobalInterceptors(new GlobalResponseInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
