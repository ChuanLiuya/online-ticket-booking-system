import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  LessThan,
  In,
} from 'typeorm';
import { Event } from './entities/event.entity';
import { EventStatus } from './types/event-status.enum';

@Injectable()
export class EventStatusSchedulerService {
  private readonly logger = new Logger(EventStatusSchedulerService.name);

  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}
  // 每分钟更新一次事件状态
  @Cron(CronExpression.EVERY_MINUTE)
  async updateEventStatuses() {
    const now = new Date();

    await this.updateOngoingEvents(now);
    await this.updateCompletedEvents(now);

    this.logger.log('Event statuses have been updated');
  }

  private async updateOngoingEvents(now: Date) {
    const result = await this.eventRepository.update(
      {
        startTime: LessThanOrEqual(now),
        endTime: MoreThanOrEqual(now),
        status: Not(In([EventStatus.ONGOING, EventStatus.CANCELLED])),
      },
      {
        status: EventStatus.ONGOING,
      },
    );

    if (result.affected && result.affected > 0) {
      this.logger.log(`Updated ${result.affected} events to ONGOING status`);
    }
  }

  private async updateCompletedEvents(now: Date) {
    const result = await this.eventRepository.update(
      {
        endTime: LessThan(now),
        status: Not(In([EventStatus.COMPLETED, EventStatus.CANCELLED])),
      },
      {
        status: EventStatus.COMPLETED,
      },
    );

    if (result.affected && result.affected > 0) {
      this.logger.log(`Updated ${result.affected} events to COMPLETED status`);
    }
  }

  async manuallyTriggerUpdate() {
    await this.updateEventStatuses();
    return { message: 'Event status update triggered manually' };
  }
}
