import { DataSource } from 'typeorm';
import { Test } from '../entities/test.entity';

export const testProviders = [
  {
    provide: 'TEST_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Test),
    inject: ['DATA_SOURCE'],
  },
];
