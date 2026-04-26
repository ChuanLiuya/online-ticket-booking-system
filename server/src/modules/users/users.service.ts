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
    const { username, email, password } = form;
    const hashedPassword = await hashPassword(password);
    return this.usersRepository.save({
      username,
      email,
      passwordHash: hashedPassword,
    });
  }

  findOneByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }
}
