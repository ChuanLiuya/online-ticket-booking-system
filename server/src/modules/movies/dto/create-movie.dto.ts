import {
  IsString,
  IsOptional,
  Min,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty({ message: '电影标题不能为空' })
  title: string;

  @IsString()
  @IsOptional()
  poster?: string;

  @IsString({ each: true })
  @IsOptional()
  directors?: string[];

  @IsString({ each: true })
  @IsOptional()
  actors?: string[];

  @IsNumber({}, { message: '电影时长必须是数字' })
  @Min(1, { message: '电影时长必须大于等于1' })
  duration: number;

  @IsString()
  @IsNotEmpty({ message: '电影描述不能为空' })
  description: string;
}
