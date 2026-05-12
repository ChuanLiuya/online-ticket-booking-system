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
  Patch,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from '../users/entities/user.entity';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { PayOrderDto } from './dto/pay-order.dto';
import { OrderStatus } from './types/order-status.enum';
import { PayParamsDto } from './dto/pay-params.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() data: CreateOrderDto, @Req() req: { user: User }) {
    const order = await this.ordersService.create(data, req.user);
    return new ApiResponseDto('创建订单成功', order);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async findMyOrders(
    @Req() req: { user: User },
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
  ) {
    const orders = await this.ordersService.findByUser(
      req.user.id,
      limit,
      page,
    );
    const total = await this.ordersService.countByUser(req.user.id);
    return new ApiResponseDto('获取我的订单成功', { total, orders });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @Req() req: { user: User }) {
    const order = await this.ordersService.findOne(id, req.user.id);
    if (!order) {
      throw new NotFoundException('订单不存在');
    }
    return new ApiResponseDto('获取订单详情成功', order);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: OrderStatus; transactionId?: string },
  ) {
    const order = await this.ordersService.updateStatus(
      id,
      body.status,
      body.transactionId,
    );
    return new ApiResponseDto('更新订单状态成功', order);
  }

  @Patch(':id/payment')
  @UseGuards(JwtAuthGuard)
  async createPayment(
    @Param('id') orderId: string,
    @Body() body: PayOrderDto,
    @Req() req: { user: User },
  ): Promise<ApiResponseDto<PayParamsDto>> {
    const params = await this.ordersService.createPayment(
      orderId,
      body,
      req.user.id,
    );
    return new ApiResponseDto('创建支付请求成功', params);
  }
}
