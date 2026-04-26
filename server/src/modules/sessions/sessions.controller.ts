import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionsService.create(createSessionDto);
  }

  @Get()
  findAll() {
    return this.sessionsService.findAll();
  }

  @Get('movie/:movieId')
  findByMovieId(@Param('movieId') movieId: string) {
    return this.sessionsService.findByMovieId(movieId);
  }

  @Get('hall/:hallId')
  findByHallId(@Param('hallId') hallId: string) {
    return this.sessionsService.findByHallId(hallId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionsService.update(id, updateSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionsService.remove(id);
  }

  @Patch(':id/seats')
  decreaseSeats(@Param('id') id: string, @Query('count') count: number = 1) {
    return this.sessionsService.decreaseSeats(id, count);
  }
}