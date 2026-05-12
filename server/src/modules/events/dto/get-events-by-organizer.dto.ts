import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
export class GetEventsByOrganizerDto {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  limit?: number = 20;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  page?: number = 1;
}
