import { IsString, IsInt, IsEnum, IsUUID } from 'class-validator';
import { HallType } from '../entities/hall.entity';

export class CreateHallDto {
  @IsString()
  name: string;

  @IsInt()
  capacity: number;

  @IsEnum(HallType)
  type: HallType;

  @IsUUID()
  cinemaId: string;
}