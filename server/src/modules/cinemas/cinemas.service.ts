import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cinema } from './entities/cinema.entity';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';

@Injectable()
export class CinemasService {
  constructor(
    @InjectRepository(Cinema)
    private readonly cinemaRepository: Repository<Cinema>,
  ) {}

  async create(createCinemaDto: CreateCinemaDto): Promise<Cinema> {
    const cinema = this.cinemaRepository.create(createCinemaDto);
    return await this.cinemaRepository.save(cinema);
  }

  async findAll(): Promise<Cinema[]> {
    return await this.cinemaRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Cinema> {
    const cinema = await this.cinemaRepository.findOne({ where: { id } });
    if (!cinema) {
      throw new NotFoundException(`Cinema with ID ${id} not found`);
    }
    return cinema;
  }

  async findByCity(city: string): Promise<Cinema[]> {
    return await this.cinemaRepository.find({
      where: { city },
      order: { rating: 'DESC' },
    });
  }

  async update(id: string, updateCinemaDto: UpdateCinemaDto): Promise<Cinema> {
    const cinema = await this.findOne(id);
    Object.assign(cinema, updateCinemaDto);
    return await this.cinemaRepository.save(cinema);
  }

  async remove(id: string): Promise<void> {
    const cinema = await this.findOne(id);
    await this.cinemaRepository.remove(cinema);
  }
}