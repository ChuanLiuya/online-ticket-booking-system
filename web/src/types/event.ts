import type { User } from "./user";
import type { TagType } from "./order";

export enum EventStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export const EventStatusLabel: Record<EventStatus, string> = {
  [EventStatus.UPCOMING]: '即将开始',
  [EventStatus.ONGOING]: '进行中',
  [EventStatus.COMPLETED]: '已完成',
  [EventStatus.CANCELED]: '已取消',
};

export const EventStatusColor: Record<EventStatus, TagType> = {
  [EventStatus.UPCOMING]: 'primary',
  [EventStatus.ONGOING]: 'success',
  [EventStatus.COMPLETED]: 'info',
  [EventStatus.CANCELED]: 'danger',
};

export interface Event {
  //数据库字段
  id: string;
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
  price: number;
  maxParticipants: number;
  currentParticipants: number;
  status: EventStatus;
  image: string;
  //organizerId: string;

  //关联用户
  organizer: User;
}

export interface createEventReqBody {
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
  price: number;
  maxParticipants: number;
}
