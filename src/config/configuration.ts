export default () => ({
  PORT: parseInt(process.env.PORT, 10) || 3000,

  database: {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    // Add other Redis-specific configurations as needed
    // password: process.env.REDIS_PASSWORD,
    // db: parseInt(process.env.REDIS_DB, 10) || 0,
  },
});
