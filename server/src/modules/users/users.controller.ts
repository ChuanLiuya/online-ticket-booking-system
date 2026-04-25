import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  register(@Body() registerDto: RegisterDto) {
    return this.usersService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentUser(@Req() req: { user: User }): User {
    const user = req.user;
    return user;
  }
}
