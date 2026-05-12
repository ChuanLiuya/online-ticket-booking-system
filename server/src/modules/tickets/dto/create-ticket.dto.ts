import { IsNotEmpty, IsString } from 'class-validator';

/**
 * 创建票 DTO
 */
export class CreateTicketDto {
  /**
   * 活动ID
   */
  @IsString()
  @IsNotEmpty({ message: '活动ID不能为空' })
  eventId: string;
  /**
   * 订单ID
   */
  @IsString()
  @IsNotEmpty({ message: '订单ID不能为空' })
  orderId: string;
}
