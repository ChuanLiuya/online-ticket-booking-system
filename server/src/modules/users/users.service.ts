import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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

  async register(form: RegisterDto): Promise<User> {
    const { username, email, password } = form;
    await this.checkEmailAvailability(email);
    await this.checkUsernameAvailability(username);
    const hashedPassword = await hashPassword(password);
    const user = await this.usersRepository.save({
      username,
      email,
      passwordHash: hashedPassword,
    });
    return user;
  }

  findOneByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  private async checkEmailAvailability(email: string): Promise<void> {
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('邮箱已存在');
    }
  }
  private async checkUsernameAvailability(username: string): Promise<void> {
    const existingUser = await this.usersRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new BadRequestException('用户名已存在');
    }
  }
  async getUserInfoById(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      await this.checkEmailAvailability(updateUserDto.email);
      user.email = updateUserDto.email;
    }

    if (updateUserDto.nickname !== undefined) {
      user.nickname = updateUserDto.nickname || '';
    }

    if (updateUserDto.phone !== undefined) {
      user.phone = updateUserDto.phone || '';
    }

    return await this.usersRepository.save(user);
  }
}
