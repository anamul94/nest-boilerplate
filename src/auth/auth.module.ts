import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy, LocalStrategy } from './stragegies';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './stragegies/jwt.strategy';
import { AuthController } from './auth.controller';
import { MailSender } from 'src/util/mailsend';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    MailSender,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
