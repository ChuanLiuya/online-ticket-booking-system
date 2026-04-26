import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest<TUser = User>(
    err: any,
    user: TUser | null,
    info: { message: string } | undefined,
  ): TUser {
    if (info && info.message === 'Missing credentials') {
      throw new BadRequestException('请输入用户名和密码');
    }
    if (err) {
      throw err;
    }
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    return user;
  }
}
