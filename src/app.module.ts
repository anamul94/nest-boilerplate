import { dataSourceOptions } from './../db/data-source';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
    }),
  ],
  providers: [AppService],
  controllers: [],
})
export class AppModule {}
