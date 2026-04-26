import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hall } from './entities/hall.entity';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';

@Injectable()
export class HallsService {
  constructor(
    @InjectRepository(Hall)
    private readonly hallRepository: Repository<Hall>,
  ) {}

  async create(createHallDto: CreateHallDto): Promise<Hall> {
    const hall = this.hallRepository.create(createHallDto);
    return await this.hallRepository.save(hall);
  }

  async findAll(): Promise<Hall[]> {
    return await this.hallRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByCinemaId(cinemaId: string): Promise<Hall[]> {
    return await this.hallRepository.find({
      where: { cinemaId },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Hall> {
    const hall = await this.hallRepository.findOne({ where: { id } });
    if (!hall) {
      throw new NotFoundException(`Hall with ID ${id} not found`);
    }
    return hall;
  }

  async update(id: string, updateHallDto: UpdateHallDto): Promise<Hall> {
    const hall = await this.findOne(id);
    Object.assign(hall, updateHallDto);
    return await this.hallRepository.save(hall);
  }

  async remove(id: string): Promise<void> {
    const hall = await this.findOne(id);
    await this.hallRepository.remove(hall);
  }
}