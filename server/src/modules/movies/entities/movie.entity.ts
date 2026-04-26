import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Director } from '../../directors/entities/director.entity';
import { Actor } from '../../actors/entities/actor.entity';

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

  // 关联导演表
  @ManyToOne(() => Director, { nullable: true })
  director: Director;

  // 关联演员表（多对多关系）
  @ManyToMany(() => Actor, { nullable: true })
  @JoinTable({
    name: 'movie_actors',
    joinColumn: { name: 'movie_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'actor_id', referencedColumnName: 'id' }
  })
  actors: Actor[];

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

  @Column({ type: 'enum', enum: MovieStatus, default: MovieStatus.COMING_SOON })
  status: MovieStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
