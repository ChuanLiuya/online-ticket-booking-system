import { IsNumber, IsOptional } from 'class-validator';
export class GetEventsByOrganizerDto {
  @IsOptional()
  @IsNumber()
  limit?: number = 20;

  @IsOptional()
  @IsNumber()
  page?: number = 1;
}
