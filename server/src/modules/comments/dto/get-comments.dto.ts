import { IsEnum, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { CommentTargetType } from '../types/comment-target-type.enum';

export class GetCommentsDto {
  @IsNotEmpty({ message: '目标ID不能为空' })
  targetId: string;

  @IsEnum(CommentTargetType, { message: '目标类型无效' })
  targetType: CommentTargetType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  parentId?: string;
}
