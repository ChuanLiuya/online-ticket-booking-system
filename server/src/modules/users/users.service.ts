import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  register(form: RegisterDto) {
    return this.usersRepository.save(form);
  }

  findOneByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }
}
