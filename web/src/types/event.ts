import type { User } from "./user";

export enum EventStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

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
