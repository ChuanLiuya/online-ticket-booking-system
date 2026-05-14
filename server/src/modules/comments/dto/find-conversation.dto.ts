/**
 * 查找对话的 DTO
 * 用于：点击"查看对话"按钮，查看某条评论下的所有对话
 * 查询条件：parentId = 指定评论ID，返回该评论的所有直接子评论
 */
export class FindConversationDto {
  /** 父评论的ID（可以是任意层级的评论） */
  parentCommentId: string;

  /** 页码，默认 1 */
  page?: number = 1;

  /** 每页数量，默认 20 */
  limit?: number = 20;
}
