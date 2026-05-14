import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CommentTargetType } from '../types/comment-target-type.enum';

/**
 * 评论实体
 * 用于存储评论数据，支持嵌套评论结构
 */
@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** 被评论目标的ID（如活动ID、用户ID、订单ID） */
  @Index()
  @Column({ type: 'varchar', length: 36 })
  targetId: string;

  /** 被评论目标的类型（event/user/order），用于区分不同类型的评论目标 */
  @Column({
    type: 'enum',
    enum: CommentTargetType,
    default: CommentTargetType.EVENT,
  })
  targetType: CommentTargetType;

  /** 评论者的ID */
  @Index()
  @Column({ type: 'varchar', length: 36 })
  userId: string;

  /** 评论者对象 */
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'text' })
  content: string;

  /** 父评论的ID，null表示顶级评论（根评论） */
  @Index()
  @Column({ type: 'varchar', length: 36, nullable: true })
  parentId: string | null;

  /** 父评论对象（关联Comment实体，级联删除），用于构建评论层级关系 */
  @ManyToOne(() => Comment, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: Comment;

  /** 根评论的ID，null表示自己是顶级评论
   * 用于快速查询某条评论下的所有回复
   * 顶级评论的 rootId 为 null，但会作为其所有子回复的 rootId
   */
  @Index()
  @Column({ type: 'varchar', length: 36, nullable: true })
  rootId: string | null;

  /** 根评论对象 */
  @ManyToOne(() => Comment, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'rootId' })
  root: Comment;

  /** 评论的点赞数量 */
  @Index()
  @Column({ type: 'int', default: 0 })
  likeCount: number;

  /** 评论的直接回复数量*/
  @Column({ type: 'int', default: 0 })
  replyCount: number;

  /** 软删除标记：false=正常评论，true=已删除（保留数据但不显示） */
  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  /** 评论创建时间 */
  @CreateDateColumn()
  createdAt: Date;

  /** 评论最后更新时间 */
  @UpdateDateColumn()
  updatedAt: Date;
}
