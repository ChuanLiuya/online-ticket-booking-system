import { IsEmail, IsOptional, Length, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式错误' })
  email?: string;

  @IsOptional()
  @Length(2, 20, { message: '昵称长度必须在2到20个字符之间' })
  nickname?: string;

  @IsOptional()
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号码格式错误' })
  phone?: string;
}
