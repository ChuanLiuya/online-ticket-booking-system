import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
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

  @Get('hot')
  async findHotEvents(
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
  ) {
    const events = await this.eventsService.findHotEvents(limit, page);
    return new ApiResponseDto('获取热点活动成功', events);
  }
}
