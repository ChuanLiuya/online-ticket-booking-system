import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from '../users/entities/user.entity';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() data: CreateEventDto, @Req() req: { user: User }) {
    const event = await this.eventsService.create({
      ...data,
      organizer: req.user,
    });
    return new ApiResponseDto('创建活动成功', event);
  }
}
