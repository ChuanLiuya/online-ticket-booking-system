import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({ message: '活动ID不能为空' })
  eventId: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: '购买数量至少为1' })
  @IsOptional()
  quantity: number = 1;
}
