import { Injectable } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';
import { Users } from 'src/modules/users/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUserByUsername(
    username: string,
    password: string,
  ): Promise<Users | null> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && user.passwordHash === password) {
      return user;
    }
    return null;
  }
}
