import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Repository, Not, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { User } from '../users/entities/user.entity';
import { Event } from '../events/entities/event.entity';
import { OrderStatus } from './types/order-status.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { PayOrderDto } from './dto/pay-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  private generateOrderNo(): string {
    const timestamp = Date.now().toString().slice(-10);
    const random = Math.random().toString(36).slice(-6).toUpperCase();
    return `ORD${timestamp}${random}`;
  }

  async create(data: CreateOrderDto, user: User): Promise<Order> {
    const event = await this.eventsRepository.findOne({
      where: { id: data.eventId },
    });

    if (!event) {
      throw new NotFoundException('活动不存在');
    }

    const existingOrder = await this.ordersRepository.findOne({
      where: {
        user: { id: user.id },
        event: { id: data.eventId },
        status: Not(In([OrderStatus.CANCELLED, OrderStatus.REFUNDED])),
      },
    });

    if (existingOrder) {
      throw new ConflictException('您已报名该活动');
    }

    if (event.currentParticipants + data.quantity > event.maxParticipants) {
      throw new ConflictException('活动名额不足');
    }

    const order = this.ordersRepository.create({
      orderNo: this.generateOrderNo(),
      user,
      event,
      quantity: data.quantity,
      unitPrice: event.price,
      totalAmount: event.price * data.quantity,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.ordersRepository.save(order);

    await this.eventsRepository.update(event.id, {
      currentParticipants: event.currentParticipants + data.quantity,
    });

    return savedOrder;
  }

  async findByUser(
    userId: string,
    limit: number = 20,
    page: number = 1,
  ): Promise<Order[]> {
    const offset = (page - 1) * limit;
    return this.ordersRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
      relations: ['event', 'event.organizer'],
    });
  }

  async findOne(id: string, userId?: string): Promise<Order | null> {
    const query: Record<string, unknown> = { id };
    if (userId) {
      query.user = { id: userId };
    }

    return this.ordersRepository.findOne({
      where: query,
      relations: ['event', 'user'],
    });
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    transactionId?: string,
  ): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['event'],
    });

    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    const now = new Date();
    const updateData: Record<string, unknown> = { status };

    switch (status) {
      case OrderStatus.PAID:
        updateData.paidAt = now;
        updateData.transactionId = transactionId;
        break;
      case OrderStatus.CANCELLED:
        updateData.cancelledAt = now;
        await this.eventsRepository.update(order.event.id, {
          currentParticipants: order.event.currentParticipants - order.quantity,
        });
        break;
      case OrderStatus.REFUNDED:
        updateData.refundedAt = now;
        break;
      case OrderStatus.COMPLETED:
        break;
    }

    await this.ordersRepository.update(id, updateData);
    const updatedOrder = await this.ordersRepository.findOne({
      where: { id },
      relations: ['event', 'user'],
    });
    if (!updatedOrder) {
      throw new NotFoundException('订单不存在');
    }
    return updatedOrder;
  }
  /**
   * 统计用户订单数量
   * @param userId 用户ID
   * @returns 订单数量
   */
  async countByUser(userId: string): Promise<number> {
    return this.ordersRepository.count({
      where: { user: { id: userId } },
    });
  }

  async payOrder(id: string, body: PayOrderDto): Promise<Order> {
    const { paymentMethod, transactionId } = body;
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['event'],
    });
    if (!order) {
      throw new NotFoundException('订单不存在');
    }
    if (order.status === OrderStatus.PAID) {
      throw new ConflictException('订单已支付，无需重复支付');
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new ConflictException('订单状态不允许支付');
    }
    const updateData: Record<string, unknown> = {
      status: OrderStatus.PAID,
      paymentMethod,
      transactionId,
    };
    await this.ordersRepository.update(id, updateData);
    const updatedOrder = await this.findOne(id);
    if (!updatedOrder) {
      throw new NotFoundException('订单不存在');
    }
    return updatedOrder;
  }
}
