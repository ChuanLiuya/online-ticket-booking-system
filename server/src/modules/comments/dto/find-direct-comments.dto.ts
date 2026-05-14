import { CommentTargetType } from '../types/comment-target-type.enum';

/**
 * 查找一级评论的 DTO
 * 用于：点开活动后，查看该活动的所有评论
 * 查询条件：targetId + targetType，查找 parentId 为 null 的评论
 */
export class FindDirectCommentsDto {
  /** 被评论目标的ID（如活动ID、用户ID） */
  targetId: string;

  /** 目标类型（event/user/order） */
  targetType: CommentTargetType;

  /** 页码，默认 1 */
  page?: number = 1;

  /** 每页数量，默认 20 */
  limit?: number = 20;
}
