import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum MovieStatus {
  COMING_SOON = 'coming_soon',
  NOW_SHOWING = 'now_showing',
  OFF_SHELF = 'off_shelf',
}

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  poster: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  director: string;

  @Column({ type: 'json', nullable: true })
  actors: string[];

  @Column({ type: 'int' })
  duration: number;

  @Column({ type: 'json', nullable: true })
  genres: string[];

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date', nullable: true })
  releasedAt: Date;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  rating: number;

  @Column({
    type: 'enum',
    enum: MovieStatus,
    default: MovieStatus.COMING_SOON,
  })
  status: MovieStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
