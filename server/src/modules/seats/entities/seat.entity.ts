import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Hall } from '../../halls/entities/hall.entity';

export enum SeatStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  DAMAGED = 'damaged',
  RESERVED = 'reserved',
}

export enum SeatType {
  NORMAL = 'normal',
  COUPLE = 'couple',
  VIP = 'vip',
  DISABLED = 'disabled',
}

@Entity('seats')
@Unique(['hallId', 'row', 'column'])
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Hall, (hall) => hall.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hallId' })
  @Column({ type: 'varchar', length: 36 })
  hallId: string;

  @Column({ type: 'int' })
  row: number;

  @Column({ type: 'int' })
  column: number;

  @Column({ type: 'enum', enum: SeatType, default: SeatType.NORMAL })
  type: SeatType;

  @Column({ type: 'enum', enum: SeatStatus, default: SeatStatus.AVAILABLE })
  status: SeatStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}