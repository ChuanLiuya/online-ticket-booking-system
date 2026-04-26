import { IsEmail, IsNotEmpty, Length, MinLength } from 'class-validator';

export class RegisterDto {
  @Length(4, 20, { message: '用户名长度必须在4到20个字符之间' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @IsEmail({}, { message: '邮箱格式错误' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @MinLength(6, { message: '密码长度必须在6个字符以上' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}
