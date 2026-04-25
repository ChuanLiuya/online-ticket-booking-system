import { Injectable } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';
import { Users } from 'src/modules/users/entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

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

  login(user: Users) {
    const payload: JwtPayload = {
      username: user.username,
      sub: user.id.toString(),
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
