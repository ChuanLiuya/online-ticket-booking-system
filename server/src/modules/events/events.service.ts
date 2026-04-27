import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { User } from '../users/entities/user.entity';

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
}
