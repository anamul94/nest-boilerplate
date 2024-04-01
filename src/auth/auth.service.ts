import { Tokens } from './types/';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as argon from 'argon2';
import { User } from 'src/users/entities/user.entity';
import { SignupDto } from './dto/signup.dto';

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
}
