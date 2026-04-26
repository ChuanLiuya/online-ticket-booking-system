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
import { SeatsService } from './seats.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Post()
  create(@Body() createSeatDto: CreateSeatDto) {
    return this.seatsService.create(createSeatDto);
  }

  @Post('batch')
  createBatch(
    @Query('hallId') hallId: string,
    @Query('rows') rows: number,
    @Query('columns') columns: number,
  ) {
    return this.seatsService.createBatch(hallId, rows, columns);
  }

  @Get()
  findAll() {
    return this.seatsService.findAll();
  }

  @Get('hall/:hallId')
  findByHallId(@Param('hallId') hallId: string) {
    return this.seatsService.findByHallId(hallId);
  }

  @Get('hall/:hallId/available')
  findAvailableByHallId(@Param('hallId') hallId: string) {
    return this.seatsService.findAvailableByHallId(hallId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seatsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSeatDto: UpdateSeatDto) {
    return this.seatsService.update(id, updateSeatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seatsService.remove(id);
  }

  @Patch(':id/reserve')
  reserveSeat(@Param('id') id: string) {
    return this.seatsService.reserveSeat(id);
  }

  @Patch(':id/occupy')
  occupySeat(@Param('id') id: string) {
    return this.seatsService.occupySeat(id);
  }

  @Patch(':id/release')
  releaseSeat(@Param('id') id: string) {
    return this.seatsService.releaseSeat(id);
  }
}