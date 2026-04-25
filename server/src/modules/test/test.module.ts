import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { testProviders } from './providers/test.providers';
import { DatabaseModule } from 'src/database/database.module';
@Module({
  imports: [DatabaseModule],
  controllers: [TestController],
  providers: [...testProviders, TestService],
})
export class TestModule {}
