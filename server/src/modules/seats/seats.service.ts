import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Seat, SeatStatus } from './entities/seat.entity';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
  ) {}

  async create(createSeatDto: CreateSeatDto): Promise<Seat> {
    const seat = this.seatRepository.create(createSeatDto);
    return await this.seatRepository.save(seat);
  }

  async createBatch(hallId: string, rows: number, columns: number): Promise<Seat[]> {
    const seats: Seat[] = [];
    for (let row = 1; row <= rows; row++) {
      for (let column = 1; column <= columns; column++) {
        const seat = this.seatRepository.create({
          hallId,
          row,
          column,
          type: 'normal' as any,
          status: SeatStatus.AVAILABLE,
        });
        seats.push(seat);
      }
    }
    return await this.seatRepository.save(seats);
  }

  async findAll(): Promise<Seat[]> {
    return await this.seatRepository.find({
      order: { hallId: 'ASC', row: 'ASC', column: 'ASC' },
    });
  }

  async findByHallId(hallId: string): Promise<Seat[]> {
    return await this.seatRepository.find({
      where: { hallId },
      order: { row: 'ASC', column: 'ASC' },
    });
  }

  async findAvailableByHallId(hallId: string): Promise<Seat[]> {
    return await this.seatRepository.find({
      where: { hallId, status: SeatStatus.AVAILABLE },
      order: { row: 'ASC', column: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Seat> {
    const seat = await this.seatRepository.findOne({ where: { id } });
    if (!seat) {
      throw new NotFoundException(`Seat with ID ${id} not found`);
    }
    return seat;
  }

  async update(id: string, updateSeatDto: UpdateSeatDto): Promise<Seat> {
    const seat = await this.findOne(id);
    Object.assign(seat, updateSeatDto);
    return await this.seatRepository.save(seat);
  }

  async remove(id: string): Promise<void> {
    const seat = await this.findOne(id);
    await this.seatRepository.remove(seat);
  }

  async reserveSeat(id: string): Promise<Seat> {
    const seat = await this.findOne(id);
    if (seat.status !== SeatStatus.AVAILABLE) {
      throw new ConflictException('Seat is not available');
    }
    seat.status = SeatStatus.RESERVED;
    return await this.seatRepository.save(seat);
  }

  async occupySeat(id: string): Promise<Seat> {
    const seat = await this.findOne(id);
    if (seat.status === SeatStatus.OCCUPIED) {
      throw new ConflictException('Seat is already occupied');
    }
    seat.status = SeatStatus.OCCUPIED;
    return await this.seatRepository.save(seat);
  }

  async releaseSeat(id: string): Promise<Seat> {
    const seat = await this.findOne(id);
    seat.status = SeatStatus.AVAILABLE;
    return await this.seatRepository.save(seat);
  }
}