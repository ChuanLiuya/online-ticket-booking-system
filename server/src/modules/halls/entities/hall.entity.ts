import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cinema } from '../../cinemas/entities/cinema.entity';

export enum HallType {
  NORMAL = 'normal',
  IMAX = 'imax',
  3D = '3d',
  4D = '4d',
  VIP = 'vip',
}

@Entity('halls')
export class Hall {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ type: 'enum', enum: HallType, default: HallType.NORMAL })
  type: HallType;

  @ManyToOne(() => Cinema, (cinema) => cinema.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cinemaId' })
  @Column({ type: 'varchar', length: 36 })
  cinemaId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}