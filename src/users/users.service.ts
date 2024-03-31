import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import UserRepository from './user.repository';
import { Role, RoleNames } from './entities';
import { RoleRepository } from './role.repository';
import { SignupDto } from 'src/auth/dto/signup.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: UserRepository,
    @InjectRepository(Role) private readonly roleRepository: RoleRepository,
  ) {}

  async getRoleByName(roleName: string): Promise<Role> {
    return this.roleRepository.findOneBy({ role: roleName });
  }

  async createUser(dto: SignupDto): Promise<User> {
    let roleId = null;
    // if (dto.roleId) {
    //   const role = await this.getRoleByName(dto.roleId);
    //   roleId = role.id;
    // }

    const newUser = await this.userRepository.save({
      ...dto,
    });
    delete newUser.password;
    return newUser;
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({ email: email });
  }

  async findUserByEmailWithRole(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOneBy({ email: email });
    const role = await user.role;
    return {
      ...user,
      role,
    };
  }
}
