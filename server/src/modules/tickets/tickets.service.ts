import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Repository, Not, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { User } from '../users/entities/user.entity';
import { Event } from '../events/entities/event.entity';
import { TicketStatus } from './types/ticket-status.enum';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  private generateTicketNo(): string {
    const timestamp = Date.now().toString().slice(-10);
    const random = Math.random().toString(36).slice(-6).toUpperCase();
    return `TKT${timestamp}${random}`;
  }
  /**
   * 创建活动票
   * @param data 创建票 DTO，包含活动ID，订单ID
   * @param userId 当前用户ID
   * @returns 创建的活动票
   * @throws NotFoundException 活动或用户不存在
   * @throws ConflictException 活动名额不足或用户已购买该活动票
   * @returns 创建的活动票
   * @description 创建活动票的完整流程：
   * 1. 检查活动，用户，订单是否存在
   * 2. 检查用户是否已购买该活动票
   * 3. 创建票记录
   */
  async create(data: CreateTicketDto, userId: string): Promise<Ticket> {
    // 检查活动是否存在
    const existingEvent = await this.eventsRepository.findOne({
      where: { id: data.eventId },
    });
    if (!existingEvent) {
      throw new NotFoundException('活动不存在');
    }
    // 检查用户是否存在
    const existingUser = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!existingUser) {
      throw new NotFoundException('用户不存在');
    }
    // 检查订单是否存在
    const existingOrder = await this.ordersRepository.findOne({
      where: { id: data.orderId },
    });
    if (!existingOrder) {
      throw new NotFoundException('订单不存在');
    }
    // 检查用户是否已购买该活动票
    const existingTicket = await this.ticketsRepository.findOne({
      where: {
        user: { id: userId },
        event: { id: data.eventId },
        status: Not(In([TicketStatus.CANCELLED, TicketStatus.REFUNDED])),
      },
    });
    if (existingTicket) {
      throw new ConflictException('您已购买该活动票');
    }
    // 创建票记录
    const ticket = this.ticketsRepository.create({
      ticketNo: this.generateTicketNo(),
      user: existingUser,
      event: existingEvent,
      order: existingOrder,
      status: TicketStatus.UNUSED,
    });

    const savedTicket = await this.ticketsRepository.save(ticket);

    return savedTicket;
  }
  /**
   * 获取用户的活动票
   * @param userId 用户ID
   * @param limit 每页数量
   * @param page 页码
   * @returns 用户的活动票列表
   * @throws NotFoundException 用户不存在
   * @description 获取用户的活动票的完整流程：
   * 1. 检查用户是否存在
   * 2. 分页查询用户购买的活动票
   */
  async findByUser(
    userId: string,
    limit: number = 20,
    page: number = 1,
  ): Promise<Ticket[]> {
    const offset = (page - 1) * limit;
    return this.ticketsRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
      relations: ['event', 'event.organizer'],
    });
  }
  async findOne(id: string): Promise<Ticket | null> {
    return this.ticketsRepository.findOne({
      where: { id },
      relations: ['event', 'user'],
    });
  }
  async findByTicketNo(ticketNo: string): Promise<Ticket | null> {
    return this.ticketsRepository.findOne({
      where: { ticketNo },
      relations: ['event', 'user'],
    });
  }
  // async updateStatus(
  //   id: string,
  //   status: TicketStatus,
  //   transactionId?: string,
  // ): Promise<Ticket> {
  //   const ticket = await this.ticketsRepository.findOne({
  //     where: { id },
  //     relations: ['event'],
  //   });

  //   if (!ticket) {
  //     throw new NotFoundException('票不存在');
  //   }

  //   const now = new Date();
  //   const updateData: Record<string, unknown> = { status };

  //   switch (status) {
  //     case TicketStatus.USED:
  //       updateData.usedAt = now;
  //       break;
  //     case TicketStatus.CANCELLED:
  //       updateData.cancelledAt = now;
  //       await this.eventsRepository.update(ticket.event.id, {
  //         currentParticipants: ticket.event.currentParticipants - 1,
  //       });
  //       break;
  //     case TicketStatus.REFUNDED:
  //       updateData.refundedAt = now;
  //       break;
  //   }

  //   await this.ticketsRepository.update(id, updateData);
  //   const updatedTicket = await this.ticketsRepository.findOne({
  //     where: { id },
  //     relations: ['event', 'user'],
  //   });
  //   if (!updatedTicket) {
  //     throw new NotFoundException('票不存在');
  //   }
  //   return updatedTicket;
  // }

  async countByUser(userId: string): Promise<number> {
    // 检查用户是否存在
    const existingUser = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!existingUser) {
      throw new NotFoundException('用户不存在');
    }
    return this.ticketsRepository.count({
      where: { user: { id: userId } },
    });
  }
}
