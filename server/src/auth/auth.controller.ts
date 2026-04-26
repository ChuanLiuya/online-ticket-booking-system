import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from 'src/modules/users/entities/user.entity';
import { AuthService } from './auth.service';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @Request() req: { user: User },
  ): ApiResponseDto<{ access_token: string; user: User }> {
    const data = this.authService.login(req.user);
    return new ApiResponseDto('登录成功', {
      access_token: data.access_token,
      user: req.user,
    });
  }
}
