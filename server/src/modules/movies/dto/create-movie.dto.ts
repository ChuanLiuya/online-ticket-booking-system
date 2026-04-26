import {
  IsString,
  IsOptional,
  IsInt,
  IsDate,
  IsEnum,
  Min,
  IsUUID,
} from 'class-validator';
import { MovieStatus } from '../entities/movie.entity';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  poster?: string;

  @IsUUID()
  @IsOptional()
  director?: string;

  @IsUUID({ each: true })
  @IsOptional()
  actors?: string[];

  @IsInt()
  @Min(1)
  duration: number;

  @IsString({ each: true })
  @IsOptional()
  genres?: string[];

  @IsString()
  @IsOptional()
  description?: string;

  @IsDate()
  @IsOptional()
  releasedAt?: Date;

  @IsEnum(MovieStatus)
  @IsOptional()
  status?: MovieStatus;
}
