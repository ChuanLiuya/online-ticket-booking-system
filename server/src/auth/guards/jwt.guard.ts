import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = User>(
    err: any,
    user: TUser | null,
    info: { name: string } | undefined,
  ) {
    if (err || !user) {
      if (info && info.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token 已过期，请重新登录');
      } else if (info && info.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('无效的 Token，请检查');
      } else if (err) {
        throw err;
      } else {
        throw new UnauthorizedException('认证失败，请重新登录');
      }
    }
    return user;
  }
}
