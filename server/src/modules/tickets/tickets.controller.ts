import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
  ParseIntPipe,
  Param,
  NotFoundException,
  // Patch,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from '../users/entities/user.entity';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
// import { TicketStatus } from './types/ticket-status.enum';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}
  /**
   * 购买活动票
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() data: CreateTicketDto, @Req() req: { user: User }) {
    const ticket = await this.ticketsService.create(data, req.user.id);
    return new ApiResponseDto('购买活动票成功', ticket);
  }
  /**
   * 获取用户的活动票
   */
  @Get('my')
  @UseGuards(JwtAuthGuard)
  async findMyTickets(
    @Req() req: { user: User },
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
  ) {
    const tickets = await this.ticketsService.findByUser(
      req.user.id,
      limit,
      page,
    );
    const total = await this.ticketsService.countByUser(req.user.id);
    return new ApiResponseDto('获取用户的活动票成功', { total, tickets });
  }
  /**
   * 通过票号获取活动票详情
   */
  @Get(':ticketNo')
  async findByTicketNo(@Param('ticketNo') ticketNo: string) {
    const ticket = await this.ticketsService.findByTicketNo(ticketNo);
    if (!ticket) {
      throw new NotFoundException('查找的活动票不存在');
    }
    return new ApiResponseDto('获取活动票详情成功', ticket);
  }
  /**
   * 更新活动票状态
   */
  // @Patch(':id/status')
  // @UseGuards(JwtAuthGuard)
  // async updateStatus(
  //   @Param('id') id: string,
  //   @Body() body: { status: TicketStatus; transactionId?: string },
  // ) {
  //   const ticket = await this.ticketsService.updateStatus(
  //     id,
  //     body.status,
  //     body.transactionId,
  //   );
  //   return new ApiResponseDto('更新活动票状态成功', ticket);
  // }
}
