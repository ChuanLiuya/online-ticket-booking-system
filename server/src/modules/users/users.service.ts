import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  register(form: RegisterDto) {
    return this.usersRepository.save(form);
  }
}
