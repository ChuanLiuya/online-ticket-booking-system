import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { TestModule } from './modules/test/test.module';

@Module({
  imports: [UsersModule, AuthModule, DatabaseModule, TestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
