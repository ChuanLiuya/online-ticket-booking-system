import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { Hall } from '../../halls/entities/hall.entity';

export enum SessionStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  ENDED = 'ended',
  CANCELLED = 'cancelled',
}

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Movie, (movie) => movie.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movieId' })
  @Column({ type: 'varchar', length: 36 })
  movieId: string;

  @ManyToOne(() => Hall, (hall) => hall.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hallId' })
  @Column({ type: 'varchar', length: 36 })
  hallId: string;

  @Column({ type: 'datetime' })
  startTime: Date;

  @Column({ type: 'datetime' })
  endTime: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  remainingSeats: number;

  @Column({ type: 'enum', enum: SessionStatus, default: SessionStatus.UPCOMING })
  status: SessionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}