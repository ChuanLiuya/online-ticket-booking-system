export type JwtExpiresIn =
  | '1d' // 1天
  | '7d' // 7天
  | '30d' // 30天
  | '1h' // 1小时
  | '30m'; // 30分钟

export const jwtConstants = {
  secret: 'jwt-secret-key',
  expiresIn: '7d' as JwtExpiresIn,
};
