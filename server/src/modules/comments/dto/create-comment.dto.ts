import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { CommentTargetType } from '../types/comment-target-type.enum';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsUUID()
  targetId: string;

  @IsEnum(CommentTargetType)
  targetType: CommentTargetType;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}
