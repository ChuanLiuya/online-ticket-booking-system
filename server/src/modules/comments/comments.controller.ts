import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from '../users/entities/user.entity';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FindDirectCommentsDto } from './dto/find-direct-comments.dto';
import { FindNestedRepliesDto } from './dto/find-nested-replies.dto';
import { FindConversationDto } from './dto/find-conversation.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() data: CreateCommentDto, @Req() req: { user: User }) {
    const comment = await this.commentsService.create(data, req.user);
    return new ApiResponseDto('评论成功', comment);
  }

  /**
   * 获取某目标的所有一级评论（直接评论）
   * 用于：点开活动详情页后，查看该活动的所有评论列表
   * @param dto 查询参数
   * @returns 一级评论列表
   */
  @Get('direct')
  async findDirectComments(@Query() dto: FindDirectCommentsDto) {
    const { comments, total } =
      await this.commentsService.findDirectComments(dto);
    return new ApiResponseDto('获取一级评论列表成功', {
      comments,
      total,
      page: dto.page || 1,
      limit: dto.limit || 20,
    });
  }

  /**
   * 获取某一级评论下的所有嵌套回复（二级和三级评论）
   * 用于：评论下方点击"展开回复"按钮，查看该评论下的所有回复
   * @param dto 查询参数
   * @returns 该一级评论下的所有嵌套回复列表
   */
  @Get('nested-replies/:rootCommentId')
  async findNestedReplies(@Param() dto: FindNestedRepliesDto) {
    const { comments, total } =
      await this.commentsService.findNestedReplies(dto);
    return new ApiResponseDto('获取嵌套回复列表成功', {
      comments,
      total,
      page: dto.page,
      limit: dto.limit,
    });
  }

  /**
   * 获取某评论下的对话（三级评论）
   * 用于：点击"查看对话"按钮，查看某条评论下的所有对话
   * @param dto 查询参数
   * @returns 该评论下的所有对话列表
   */
  @Get('conversation/:parentCommentId')
  async findConversation(@Param() dto: FindConversationDto) {
    const { comments, total } =
      await this.commentsService.findConversation(dto);
    return new ApiResponseDto('获取对话列表成功', {
      comments,
      total,
      page: dto.page,
      limit: dto.limit,
    });
  }

  /**
   * 获取评论详情
   * @param id 评论ID
   * @returns 评论详情
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const comment = await this.commentsService.findOne(id);
    return new ApiResponseDto('获取评论详情成功', comment);
  }

  /**
   * 修改评论
   * @param id 评论ID
   * @param content 评论内容
   * @param user 评论者
   * @returns 修改后的评论
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body('content') content: string,
    @Req() req: { user: User },
  ) {
    const comment = await this.commentsService.update(id, content, req.user);
    return new ApiResponseDto('修改评论成功', comment);
  }

  /**
   * 删除评论
   * @param id 评论ID
   * @param user 删除者
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Req() req: { user: User }) {
    await this.commentsService.remove(id, req.user);
    return new ApiResponseDto('删除评论成功', null);
  }
}
