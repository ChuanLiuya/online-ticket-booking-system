import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class PayOrderDto {
  @IsString()
  @IsNotEmpty({ message: '支付方式不能为空' })
  paymentMethod: string;

  @IsString()
  @IsOptional()
  transactionId?: string;
}
