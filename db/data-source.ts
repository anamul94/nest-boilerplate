import { DataSourceOptions, DataSource } from 'typeorm';

import * as dotenv from 'dotenv';
dotenv.config();

const type: any = process.env.DB_TYPE;

export const dataSourceOptions: DataSourceOptions = {
  type: type || 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
};

const datasorce = new DataSource(dataSourceOptions);

export default datasorce;
