import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { User } from '../users/entities/user.entity';
import { EventStatus } from './types/event-status.enum';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async create(data: CreateEventDto & { organizer: User }): Promise<Event> {
    const event = this.eventsRepository.create(data);
    return this.eventsRepository.save(event);
  }

  async findHotEvents(limit: number = 20, page: number = 1): Promise<Event[]> {
    const offset = (page - 1) * limit;
    return this.eventsRepository.find({
      where: {
        status: EventStatus.UPCOMING,
      },
      order: {
        currentParticipants: 'DESC',
      },
      take: limit,
      skip: offset,
      relations: ['organizer'],
    });
  }

  async findOne(id: string): Promise<Event | null> {
    return this.eventsRepository.findOne({
      where: { id },
      relations: ['organizer'],
    });
  }
}
