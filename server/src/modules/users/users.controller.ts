import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Users } from './entities/users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  register(@Body() registerDto: RegisterDto) {
    return this.usersService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentUser(@Req() req: { user: Users }): Users {
    const user = req.user;
    return user;
  }
}
