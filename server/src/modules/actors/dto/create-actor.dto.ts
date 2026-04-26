import {
  IsString,
  IsOptional,
  IsDate,
} from 'class-validator';

export class CreateActorDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsDate()
  @IsOptional()
  birthDate?: Date;
}
