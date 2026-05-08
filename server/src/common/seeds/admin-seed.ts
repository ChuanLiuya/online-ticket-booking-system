import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { hashPassword } from '../utils/bcrypt';
import { User } from '../../modules/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config({
  path: ['.env', `.env.${process.env.NODE_ENV || 'development'}`],
});
async function seed() {
  const configService = new ConfigService();

  const dataSource = new DataSource({
    type: 'mysql',
    host: configService.get('DB_HOST', 'localhost'),
    port: Number(configService.get('DB_PORT', 3306)),
    username: configService.get('DB_USERNAME', 'root'),
    password: configService.get('DB_PASSWORD', 'default-password'),
    database: configService.get('DB_DATABASE', 'default-database'),
    entities: [User],
    synchronize: true,
  });

  await dataSource.initialize();
  console.log('数据库连接成功');

  const userRepository = dataSource.getRepository(User);

  const adminUsername = 'admin';
  const adminEmail = 'admin@example.com';
  const adminPassword = '123456';

  const existingAdmin = await userRepository.findOne({
    where: { username: adminUsername },
  });

  if (existingAdmin) {
    console.log(`管理员账号 ${adminUsername} 已存在，跳过创建`);
    await dataSource.destroy();
    return;
  }

  const hashedPassword = await hashPassword(adminPassword);

  const admin = userRepository.create({
    username: adminUsername,
    email: adminEmail,
    passwordHash: hashedPassword,
    role: 'admin',
    nickname: '系统管理员',
  });

  await userRepository.save(admin);
  console.log(`✅ 管理员账号创建成功！`);
  console.log(`用户名: ${adminUsername}`);
  console.log(`密码: ${adminPassword}`);
  console.log(`邮箱: ${adminEmail}`);
  console.log('⚠️  请立即修改默认密码并妥善保管！');

  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('Seed 脚本执行失败:', error);
  process.exit(1);
});
