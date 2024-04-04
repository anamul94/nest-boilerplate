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

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

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
}
