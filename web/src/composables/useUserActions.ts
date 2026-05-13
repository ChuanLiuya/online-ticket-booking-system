import { userApi } from "@/apis/user"

export function useUserActions () {
  async function getUserInfoById (userId: string) {
    const res = await userApi.getUserInfoById(userId)
    console.log('获取指定用户信息成功', res.data.data)
    return res.data.data
  }
  return { getUserInfoById }
}
