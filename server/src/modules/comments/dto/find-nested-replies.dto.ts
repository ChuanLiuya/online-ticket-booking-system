/**
 * 查找嵌套回复的 DTO
 * 用于：评论下方点击"展开回复"按钮，查看该评论下的所有回复
 * 查询条件：rootId（根评论ID），返回该根评论的所有后代评论
 */
export class FindNestedRepliesDto {
  /** 一级评论的ID（根评论ID） */
  rootCommentId: string;

  /** 页码，默认 1 */
  page?: number = 1;

  /** 每页数量，默认 20 */
  limit?: number = 20;
}
