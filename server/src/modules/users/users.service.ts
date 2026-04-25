import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from 'src/common/utils/bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(form: RegisterDto) {
    form.password = await hashPassword(form.password);
    return this.usersRepository.save(form);
  }

  findOneByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }
}
