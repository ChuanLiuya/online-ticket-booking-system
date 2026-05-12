import { eventApi } from '@/apis/event'
import { userApi } from '@/apis/user'

export function useEventActions() {
  async function findEventById(id: string) {
    const res = await eventApi.findOne(id)
    return res.data.data
  }
  /**
   * 获取指定用户举办的活动
   * @param organizerId 活动组织者ID
   * @param page 页码
   * @param limit 每页数量
   * @returns 活动列表和总数量
   * @example
   * const {total,events} = await findEventsByOrganizerId('123456',{page: 1,limit: 20})
   */
  async function findEventsByOrganizerId(organizerId: string,{page = 1,limit = 20}: {page: number, limit: number}): Promise<{total: number, events: Event[]}> {
    const res = await userApi.getEventsByOrganizerId(organizerId,{page,limit})
    console.log('获取指定用户举办的活动成功',res)
    return res.data.data
  }

  return { findEventById, findEventsByOrganizerId }
}
