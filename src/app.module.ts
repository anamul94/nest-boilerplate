import { dataSourceOptions } from './../db/data-source';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './user/user.module';
import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggingMiddleware } from './middlewares/logging.middleware';
import { FileuploadController } from './fileupload/fileupload.controller';
import { FileuploadModule } from './fileupload/fileupload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
    }),
    FileuploadModule,
  ],
  providers: [],
  controllers: [FileuploadController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
