import { DataSource, DataSourceOptions } from 'typeorm';
import { envs } from '../config/env';
import { Animal } from '../animal/entities/animal.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  username: envs.DB_USERNAME,
  password: envs.DB_PASSWORD,
  database: envs.DB_NAME,
  entities: [Animal],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
