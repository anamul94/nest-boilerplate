import { Role } from './entities/role.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import UserRepository from './user.repository';
import { RoleRepository } from './role.repository';
import { SignupDto } from 'src/auth/dto/signup.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: UserRepository,
    @InjectRepository(Role) private readonly roleRepository: RoleRepository,
  ) {}

  async getRoleByName(roleName: string): Promise<Role> {
    return this.roleRepository.findOneBy({ roleName: roleName });
  }

  async createUser(dto: SignupDto): Promise<User> {
    const role = await this.roleRepository.findOneBy({ id: dto.roleId });
    if (!role) {
      throw new BadRequestException('Role not found.');
    }

    const { firstName, lastName, email, password } = dto;

    const newUser = await this.userRepository.create({
      firstName,
      lastName,
      email,
      password,
      role,
    });
    console.log(newUser);
    await newUser.role;
    const savedUser = await this.userRepository.save(newUser);
    delete savedUser.password;
    return savedUser;
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({ email: email });
  }

  async findUserByEmailWithRole(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOneBy({ email: email });
    if (!user) {
      return undefined;
    }
    const role = await user.role;
    if (role) {
      return {
        ...user,
        role,
      };
    }
    return user;
  }
}
