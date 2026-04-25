import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants/jwt-constants';
import { JwtPayload } from '../dto/jwt-payload.dto';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload) {
    // 进入此处代表jwt有效
    const user = await this.usersService.findOneByUsername(payload.username);
    // jwt有效，但是未找到用户
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    return user;
  }
}
