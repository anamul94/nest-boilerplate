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

@Injectable()
export class AuthService {
  private OTP: Record<string, { code: string; expiry: Date }> = {};
  private OTP_VALIDATION: Record<string, Date> = {};

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailSender: MailSender,
  ) {
    let OTP: Record<number, string> = {};
  }

  async signUp(dto: SignupDto): Promise<User> {
    // if (!dto) {
    //   throw new BadRequestException();
    // }
    const hashedPass = await argon.hash(dto.password);
    dto.password = hashedPass;

    return await this.usersService.createUser(dto);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByEmailWithRole(email);
    if (user && (await argon.verify(user.password, pass))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<Tokens> {
    const role = user.role ? user.role.roleName : undefined;
    const payload = { email: user.email, sub: user.id, role: role };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }

  async googleAuth(req) {
    console.log(req.user);
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
}
