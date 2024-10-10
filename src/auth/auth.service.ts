import { last } from 'rxjs';
import { Tokens } from './types/';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/user/user.service';
import * as argon from 'argon2';
import { User } from 'src/user/entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailSender } from 'src/util/mailsend';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class AuthService {
  private OTP: Record<string, { code: string; expiry: Date }> = {};
  private OTP_VALIDATION: Record<string, Date> = {};

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailSender: MailSender,
    @InjectRedis() private readonly redis: Redis,
  ) {
    let OTP: Record<number, string> = {};
  }

  async signUp(dto: SignupDto): Promise<User> {
    const hashedPass = await argon.hash(dto.password);
    dto.password = hashedPass;

    const user = await this.usersService.createUser(dto);

    // Save email, hashed password, role, and id to Redis
    await this.saveUserCredentialsToRedis(
      user.email,
      hashedPass,
      user.id,
      user.role?.roleName,
    );

    return user;
  }

  private async saveUserCredentialsToRedis(
    email: string,
    hashedPassword: string,
    id: string,
    role?: string,
  ): Promise<void> {
    const userInfo = JSON.stringify({
      id,
      password: hashedPassword,
      role: role || null,
    });

    await this.redis.set(
      email,
      userInfo,
      'EX',
      86400, // Expire after 24 hours (86400 seconds)
    );
  }

  async validateUser(email: string, pass: string): Promise<any> {
    // First, check Redis for the user's credentials
    const redisUserInfo = await this.redis.get(email);

    if (redisUserInfo) {
      const {
        id,
        password: redisHashedPassword,
        role: redisRole,
      } = JSON.parse(redisUserInfo);
      // If found in Redis, verify the password
      if (await argon.verify(redisHashedPassword, pass)) {
        // Return the user info directly from Redis
        return { id, email, role: redisRole };
      }
    } else {
      // If not found in Redis, check the database
      const user = await this.usersService.findUserByEmailWithRole(email);
      if (user && (await argon.verify(user.password, pass))) {
        // If valid, store in Redis for future checks
        await this.saveUserCredentialsToRedis(
          user.email,
          user.password,
          user.id,
          user.role?.roleName,
        );
        const { password, ...result } = user;
        return result;
      }
    }

    return null;
  }

  async login(user: User): Promise<Tokens> {
    const role = user.role ? user.role.roleName : undefined;
    const payload = { email: user.email, sub: user.id, role: role };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }

  async logout(token: string): Promise<void> {
    const decoded: any = this.jwtService.decode(token);
    const tokenExpiry = decoded.exp * 1000; // Convert seconds to milliseconds

    // Calculate the remaining TTL for the token
    const currentTime = Date.now();
    const ttl = tokenExpiry - currentTime;

    // If token hasn't expired, store it in Redis with its TTL
    if (ttl > 0) {
      await this.redis.set(token, 'blacklisted', 'PX', ttl);
    }
  }

  async googleAuth(req) {
    console.log(req.user);
    const { email, firstName, lastName } = req.user;
    let user = await this.usersService.findUserByEmail(email);
    if (!user) {
      user = await this.usersService.createUserWithoutPassword({
        email,
        firstName,
        lastName,
      });
      const access_token = await this.jwtService.signAsync({
        email,
        sub: user.id,
      });
      return { access_token };
    }
  }

  async resetPassword(email: string, dto: ResetPasswordDto): Promise<string> {
    try {
      const user = await this.usersService.findUserByEmail(email);
      if (!user) {
        throw new BadRequestException('User not found.');
      }
      if (!(await argon.verify(user.password, dto.oldPassword))) {
        throw new ForbiddenException();
      }

      const hashedPass = await argon.hash(dto.newPassword);
      user.password = hashedPass;
      await this.usersService.saveUser(user);
      return 'Password has been reset.';
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async genForgotPasswordOtp(email: string): Promise<void> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found.');
    }
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

    this.OTP[email] = { code: otpCode, expiry: otpExpiry };

    this.mailSender.mailSend(
      email,
      user.firstName,
      'Forgot Password',
      `Your OTP is ${otpCode} expiresIn ${otpExpiry}`,
    );
  }

  async validateOTP(email: string, otp: string): Promise<boolean> {
    const storedOTP = this.OTP[email];

    if (!storedOTP) {
      throw new BadRequestException('OTP not found for the provided email');
    }

    if (new Date() > storedOTP.expiry) {
      throw new BadRequestException('OTP has expired');
    }

    const isValidOTP = otp === storedOTP.code;

    if (isValidOTP) {
      delete this.OTP[email];
    }
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 10);
    this.OTP_VALIDATION[email] = expiryTime;

    return isValidOTP;
  }

  async setNewPassword(dto: ForgotPasswordDto): Promise<string> {
    try {
      const user = await this.usersService.findUserByEmail(dto.email);
      if (!user) {
        throw new BadRequestException('User not found.');
      }
      if (!this.OTP_VALIDATION[dto.email]) {
        throw new BadRequestException('OTP has not been validated.');
      }
      if (this.OTP_VALIDATION[dto.email] < new Date()) {
        throw new BadRequestException('OTP has expired');
      }
      const hashedPass = await argon.hash(dto.password);
      user.password = hashedPass;
      await this.usersService.saveUser(user);
      return 'Password has been reset.';
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async isTokenBlacklisted(userId: number, token: string): Promise<boolean> {
    const blacklisted = await this.redis.get(`bl_${userId}_${token}`);
    return !!blacklisted;
  }
}
