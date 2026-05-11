import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
  ParseIntPipe,
  Param,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from '../users/entities/user.entity';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { CreateEventDto, UpdateEventDto } from './dto/create-event.dto';

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

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async findMyEvents(@Req() req: { user: User }) {
    const events = await this.eventsService.findByOrganizer(req.user.id);
    return new ApiResponseDto('获取我的活动成功', events);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const event = await this.eventsService.findOne(id);
    if (!event) {
      throw new NotFoundException('活动不存在');
    }
    return new ApiResponseDto('获取活动详情成功', event);
  }

  @Get('hot/count')
  async countHotEvents() {
    const count = await this.eventsService.countHotEvents();
    return new ApiResponseDto('获取热点活动总数成功', count);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateEventDto,
    @Req() req: { user: User },
  ) {
    const event = await this.eventsService.update(id, data, req.user);
    return new ApiResponseDto('更新活动成功', event);
  }
}
