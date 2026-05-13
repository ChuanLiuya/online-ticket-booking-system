import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from './entities/user.entity';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { EventsService } from '../events/events.service';
import { GetEventsByOrganizerDto } from '../events/dto/get-events-by-organizer.dto';
import { Event } from '../events/entities/event.entity';

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

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateCurrentUser(
    @Req() req: { user: User },
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponseDto<User>> {
    const user = await this.usersService.updateUser(req.user.id, updateUserDto);
    return new ApiResponseDto('更新用户信息成功', user);
  }

  @Get(':userId/events')
  async getUserEvents(
    @Param('userId') userId: string,
    @Query() getEventsByOrganizerDto: GetEventsByOrganizerDto,
  ): Promise<ApiResponseDto<{ events: Event[]; total: number }>> {
    const events = await this.eventsService.getEventsByOrganizer(
      userId,
      getEventsByOrganizerDto.limit,
      getEventsByOrganizerDto.page,
    );
    const total = await this.eventsService.countByOrganizer(userId);
    return new ApiResponseDto('获取指定用户举办的活动成功', {
      events,
      total,
    });
  }

  @Get(':userId')
  async getUserInfoById(
    @Param('userId') userId: string,
  ): Promise<ApiResponseDto<User>> {
    const user = await this.usersService.getUserInfoById(userId);
    return new ApiResponseDto('获取指定用户信息成功', user);
  }
}
