import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
  IsString,
  Min,
} from 'class-validator';
import { EventStatus } from '../types/event-status.enum';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty({ message: '活动标题不能为空' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '活动描述不能为空' })
  description: string;

  @IsString()
  @IsNotEmpty({ message: '活动地点不能为空' })
  location: string;

  @IsDateString()
  @IsNotEmpty({ message: '活动开始时间不能为空' })
  startTime: Date;

  @IsDateString()
  @IsNotEmpty({ message: '活动结束时间不能为空' })
  endTime: Date;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsNotEmpty({ message: '活动价格不能为空' })
  price: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsNotEmpty({ message: '活动最大参与人数不能为空' })
  maxParticipants: number;

  @IsString()
  @IsOptional()
  image?: string;
}

export class UpdateEventDto extends CreateEventDto {
  @IsOptional()
  status?: EventStatus;
}
