import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Event } from '../../events/entities/event.entity';
import { Order } from '../../orders/entities/order.entity';
import { TicketStatus } from '../types/ticket-status.enum';

@Entity('tickets')
export class Ticket {
  /**
   * 票id
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;
  /**
   * 票号
   */
  @Column({ type: 'varchar', length: 50, unique: true })
  ticketNo: string;
  /**
   * 购买票的用户
   */
  @Index()
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
  /**
   * 票对应的活动
   */
  @Index()
  @ManyToOne(() => Event)
  @JoinColumn()
  event: Event;
  /**
   * 票对应的订单
   */
  @Index()
  @ManyToOne(() => Order)
  @JoinColumn()
  order: Order;
  /**
   * 票的状态
   */
  @Index()
  @Column({
    type: 'enum',
    default: TicketStatus.UNUSED,
    enum: TicketStatus,
  })
  status: TicketStatus;
  /**
   * 票的使用时间
   */
  @Column({ type: 'datetime', nullable: true })
  usedAt: Date;
  /**
   * 票的取消时间
   */
  @Column({ type: 'datetime', nullable: true })
  cancelledAt: Date;
  /**
   * 票的退款时间
   */
  @Column({ type: 'datetime', nullable: true })
  refundedAt: Date;
  /**
   * 票的创建时间
   */
  @CreateDateColumn()
  createdAt: Date;
  /**
   * 票的更新时间
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
