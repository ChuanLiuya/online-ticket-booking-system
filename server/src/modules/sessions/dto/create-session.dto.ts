import { IsString, IsNumber, IsDate, IsEnum, IsUUID, Min, Max } from 'class-validator';
import { SessionStatus } from '../entities/session.entity';

export class CreateSessionDto {
  @IsUUID()
  movieId: string;

  @IsUUID()
  hallId: string;

  @IsDate()
  startTime: Date;

  @IsDate()
  endTime: Date;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  remainingSeats: number;

  @IsEnum(SessionStatus)
  status: SessionStatus;
}