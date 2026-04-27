import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from './entities/user.entity';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async register(@Body() registerDto: RegisterDto) {
    const data = await this.usersService.register(registerDto);
    return new ApiResponseDto('注册成功', data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getCurrentUser(@Req() req: { user: User }): ApiResponseDto<User> {
    const user = req.user;
    return new ApiResponseDto('获取用户信息成功', user);
  }
}
