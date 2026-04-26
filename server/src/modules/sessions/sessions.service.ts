import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session, SessionStatus } from './entities/session.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    const session = this.sessionRepository.create(createSessionDto);
    return await this.sessionRepository.save(session);
  }

  async findAll(): Promise<Session[]> {
    return await this.sessionRepository.find({
      order: { startTime: 'ASC' },
    });
  }

  async findByMovieId(movieId: string): Promise<Session[]> {
    return await this.sessionRepository.find({
      where: { movieId, status: SessionStatus.UPCOMING },
      order: { startTime: 'ASC' },
    });
  }

  async findByHallId(hallId: string): Promise<Session[]> {
    return await this.sessionRepository.find({
      where: { hallId },
      order: { startTime: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({ where: { id } });
    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }
    return session;
  }

  async update(id: string, updateSessionDto: UpdateSessionDto): Promise<Session> {
    const session = await this.findOne(id);
    Object.assign(session, updateSessionDto);
    return await this.sessionRepository.save(session);
  }

  async remove(id: string): Promise<void> {
    const session = await this.findOne(id);
    await this.sessionRepository.remove(session);
  }

  async decreaseSeats(id: string, count: number = 1): Promise<Session> {
    const session = await this.findOne(id);
    if (session.remainingSeats < count) {
      throw new ConflictException('Not enough seats available');
    }
    session.remainingSeats -= count;
    return await this.sessionRepository.save(session);
  }
}
