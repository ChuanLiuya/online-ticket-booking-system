import { IsString, IsNumber, IsEnum, IsUUID, Min } from 'class-validator';
import { SeatType, SeatStatus } from '../entities/seat.entity';

export class CreateSeatDto {
  @IsUUID()
  hallId: string;

  @IsNumber()
  @Min(1)
  row: number;

  @IsNumber()
  @Min(1)
  column: number;

  @IsEnum(SeatType)
  type: SeatType;

  @IsEnum(SeatStatus)
  status: SeatStatus;
}