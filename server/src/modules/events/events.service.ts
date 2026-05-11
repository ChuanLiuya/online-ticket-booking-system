import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto, UpdateEventDto } from './dto/create-event.dto';
import { User } from '../users/entities/user.entity';
import { EventStatus } from './types/event-status.enum';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async create(data: CreateEventDto & { organizer: User }): Promise<Event> {
    const event = this.eventsRepository.create({
      ...data,
      status: this.calculateStatus(data.startTime, data.endTime),
    });
    return this.eventsRepository.save(event);
  }

  private calculateStatus(startTime: Date, endTime: Date): EventStatus {
    const now = new Date();
    if (now >= startTime && now <= endTime) {
      return EventStatus.ONGOING;
    }
    if (now > endTime) {
      return EventStatus.COMPLETED;
    }
    return EventStatus.UPCOMING;
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

  async countHotEvents(): Promise<number> {
    return this.eventsRepository.count({
      where: {
        status: EventStatus.UPCOMING,
      },
    });
  }

  async update(id: string, data: UpdateEventDto, user: User): Promise<Event> {
    const event = await this.findOne(id);
    if (!event) {
      throw new Error('活动不存在');
    }
    if (event.organizer.id !== user.id) {
      throw new Error('只有活动组织者才能更新活动');
    }
    Object.assign(event, data);
    event.status = this.calculateStatus(event.startTime, event.endTime);
    return this.eventsRepository.save(event);
  }

  async findByOrganizer(organizerId: string): Promise<Event[]> {
    return this.eventsRepository.find({
      where: {
        organizer: { id: organizerId },
      },
      order: {
        startTime: 'DESC',
      },
      relations: ['organizer'],
    });
  }
}
