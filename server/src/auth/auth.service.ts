import { Injectable } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';
import { User } from 'src/modules/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload.dto';
import { comparePassword } from 'src/common/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUserByUsername(
    username: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && (await comparePassword(password, user.passwordHash))) {
      return user;
    }
    return null;
  }

  login(user: User) {
    const payload: JwtPayload = {
      username: user.username,
      sub: user.id.toString(),
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
