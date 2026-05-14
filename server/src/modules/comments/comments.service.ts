import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Repository, IsNull } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FindNestedRepliesDto } from './dto/find-nested-replies.dto';
import { FindConversationDto } from './dto/find-conversation.dto';
import { User } from '../users/entities/user.entity';
import { CommentTargetType } from './types/comment-target-type.enum';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}
  /**
   * 创建评论
   * @param data 评论数据
   * - targetId: string - 被评论目标的ID（如活动ID、用户ID）
   * - targetType: CommentTargetType - 目标类型
   * - content: string - 评论内容
   * - parentId?: string - 父评论ID，若为顶级评论则为 null
   * @param user 评论者，jwt认证后的用户对象
   * @returns 创建的评论
   */
  async create(data: CreateCommentDto, user: User): Promise<Comment> {
    const comment = this.commentsRepository.create({
      targetId: data.targetId,
      targetType: data.targetType,
      userId: user.id,
      content: data.content,
      parentId: data.parentId || null,
    });
    // 处理 rootId
    if (data.parentId) {
      // 子评论，设置 rootId 为父评论的 rootId 或父评论的 ID
      const parentComment = await this.commentsRepository.findOne({
        where: { id: data.parentId, isDeleted: false },
      });
      if (!parentComment) {
        throw new NotFoundException('父评论不存在');
      }
      comment.rootId = parentComment.rootId || parentComment.id;
    } else {
      // 顶级评论，设置 rootId 为 null
      comment.rootId = null;
    }
    return this.commentsRepository.save(comment);
  }
  /**
   * 查找某目标的所有一级评论（直接评论）
   * 用于：点开活动详情页后，查看该活动的所有评论列表
   * 查询条件：targetId + targetType + parentId=null（顶级评论）
   * @param dto 查询参数
   * - targetId: 被评论目标的ID（如活动ID、用户ID）
   * - targetType: 目标类型（event/user/order）
   * - page?: number - 页码，默认 1
   * - limit?: number - 每页数量，默认 20
   * @returns 一级评论列表（按时间倒序）
   */
  async findDirectComments(
    targetId: string,
    targetType: CommentTargetType,
    page = 1,
    limit = 20,
  ): Promise<Comment[]> {
    if (!targetId) {
      throw new NotFoundException('目标ID不能为空');
    }
    if (!Object.values(CommentTargetType).includes(targetType)) {
      throw new ForbiddenException('无效的目标类型');
    }
    const comments = await this.commentsRepository.find({
      where: {
        targetId,
        targetType,
        isDeleted: false,
        parentId: IsNull(),
      },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
      relations: ['user'], // 加载评论者信息
    });

    return comments;
  }

  /**
   * 查找某一级评论下的所有嵌套回复（二级和三级评论）
   * 用于：评论下方点击"展开回复"按钮，查看该评论下的所有回复
   * 查询条件：rootId（根评论ID），返回该根评论的所有后代评论
   * @param dto 查询参数
   * - rootCommentId: 一级评论的ID
   * - page?: number - 页码，默认 1
   * - limit?: number - 每页数量，默认 20
   * @returns 该一级评论下的所有嵌套回复列表（按时间升序）
   */
  async findNestedReplies(
    dto: FindNestedRepliesDto,
  ): Promise<{ comments: Comment[]; total: number }> {
    const { rootCommentId, page = 1, limit = 20 } = dto;

    const rootComment = await this.commentsRepository.findOne({
      where: { id: rootCommentId, isDeleted: false, parentId: IsNull() },
    });
    if (!rootComment) {
      throw new NotFoundException('一级评论不存在');
    }

    const [comments, total] = await this.commentsRepository.findAndCount({
      where: {
        rootId: rootCommentId,
        isDeleted: false,
      },
      order: { createdAt: 'ASC' },
      take: limit,
      skip: (page - 1) * limit,
      relations: ['user'],
    });

    return { comments, total };
  }

  /**
   * 查找某二级评论下的对话（三级评论）
   * 用于：点击"查看对话"按钮，查看某条评论下的所有对话
   * 查询条件：parentId = 二级评论ID
   * @param dto 查询参数
   * - parentCommentId: 二级评论的ID
   * - page?: number - 页码，默认 1
   * - limit?: number - 每页数量，默认 20
   * @returns 该二级评论下的所有直接回复列表（按时间升序）
   */
  async findConversation(
    dto: FindConversationDto,
  ): Promise<{ comments: Comment[]; total: number }> {
    const { parentCommentId, page = 1, limit = 20 } = dto;

    const parentComment = await this.commentsRepository.findOne({
      where: { id: parentCommentId, isDeleted: false },
    });
    if (!parentComment) {
      throw new NotFoundException('评论不存在');
    }

    const [comments, total] = await this.commentsRepository.findAndCount({
      where: {
        parentId: parentCommentId,
        isDeleted: false,
      },
      order: { createdAt: 'ASC' },
      take: limit,
      skip: (page - 1) * limit,
      relations: ['user'],
    });

    return { comments, total };
  }

  async findOne(id: string): Promise<Comment | null> {
    return this.commentsRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['user', 'parent', 'root'],
    });
  }

  async update(id: string, content: string, user: User): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!comment) {
      throw new NotFoundException('评论不存在');
    }

    if (comment.userId !== user.id) {
      throw new ForbiddenException('只能修改自己的评论');
    }

    comment.content = content;
    return this.commentsRepository.save(comment);
  }

  async remove(id: string, user: User): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!comment) {
      throw new NotFoundException('评论不存在');
    }

    if (comment.userId !== user.id) {
      throw new ForbiddenException('只能删除自己的评论');
    }

    comment.isDeleted = true;
    await this.commentsRepository.save(comment);
  }
  async getAllCommentCountByTarget(
    targetId: string,
    targetType: CommentTargetType,
  ): Promise<number> {
    if (!targetId) {
      throw new NotFoundException('目标ID不能为空');
    }
    if (!Object.values(CommentTargetType).includes(targetType)) {
      throw new ForbiddenException('无效的目标类型');
    }
    return this.commentsRepository.count({
      where: { isDeleted: false, targetId, targetType },
    });
  }

  async getDirectCommentCount({
    targetId,
    targetType,
  }: {
    targetId: string;
    targetType: CommentTargetType;
  }): Promise<number> {
    return this.commentsRepository.count({
      where: {
        targetId,
        targetType,
        isDeleted: false,
        parentId: IsNull(),
      },
    });
  }

  async getReplyCount(commentId: string): Promise<number> {
    return this.commentsRepository.count({
      where: {
        rootId: commentId,
        isDeleted: false,
      },
    });
  }
}
