import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from './entities/user.entity';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { EventsService } from '../events/events.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly eventsService: EventsService,
  ) {}

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

  @Get(':userId/events')
  async getUserEvents(@Param('userId') userId: string) {
    const events = await this.eventsService.getEventsByOrganizer(userId);
    return new ApiResponseDto('获取指定用户举办的活动成功', events);
  }
}
