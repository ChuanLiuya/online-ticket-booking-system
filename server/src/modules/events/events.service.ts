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

  /**
   * 更新活动信息
   *
   * 根据提供的ID和数据，在数据库中修改对应的活动记录。
   * @param {number|string} id - 活动ID，唯一标识一个活动
   * @param {UpdateEventDto} data - 更新活动的字段值
   * @param {User} user - 当前登录用户，用于检查用户权限
   * @returns {Promise<Object>} 返回更新后的完整活动对象
   * @example
   * // 调用示例
   * const updated = await update('019ff143-f937-4ca3-a037-8927d7e5c728', { title: '新标题' }, currentUser);
   * console.log(updated.title);
   * // 函数流程
   * 1. 根据提供的ID检查活动是否存在
   * 2. 检查用户是否为活动组织者
   * 3. 检查最大参与人数是否小于当前参与人数
   * 4. 更新活动信息
   * 5. 返回更新后的活动对象
   */
  async update(id: string, data: UpdateEventDto, user: User): Promise<Event> {
    const event = await this.findOne(id);
    if (!event) {
      throw new Error('活动不存在');
    }
    if (event.organizer.id !== user.id) {
      throw new Error('只有活动组织者才能更新活动');
    }
    if (data.maxParticipants < event.currentParticipants) {
      throw new Error('最大参与人数不能小于当前参与人数');
    }
    Object.assign(event, data);
    event.status = this.calculateStatus(event.startTime, event.endTime);
    return this.eventsRepository.save(event);
  }

  async findByOrganizer(
    organizerId: string,
    limit: number = 20,
    page: number = 1,
  ): Promise<Event[]> {
    const offset = (page - 1) * limit;
    return this.eventsRepository.find({
      where: {
        organizer: { id: organizerId },
      },
      order: {
        startTime: 'DESC',
      },
      take: limit,
      skip: offset,
      relations: ['organizer'],
    });
  }

  /**
   * 统计用户组织的活动数量
   * @param organizerId 用户ID
   * @returns 活动数量
   */
  async countByOrganizer(organizerId: string): Promise<number> {
    return this.eventsRepository.count({
      where: {
        organizer: { id: organizerId },
      },
    });
  }
}
