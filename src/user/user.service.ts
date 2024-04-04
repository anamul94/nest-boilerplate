import { Role } from './entities/role.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import UserRepository from './user.repository';
import { RoleRepository } from './role.repository';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { RoleUpdateDto } from './dto/role.update.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
    const isUser = await this.userRepository.findOneBy({ email: dto.email });
    if (isUser) {
      throw new BadRequestException('User already exists.');
    }
    let role: Role;
    if (dto.roleId) {
      role = await this.roleRepository.findOneBy({ id: dto.roleId });
      if (!role) {
        throw new BadRequestException('Role not found.');
      }
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

  async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new BadRequestException('User not found.');
    }
    if (dto.firstName) user.firstName = dto.firstName;
    if (dto.lastName) user.lastName = dto.lastName;
    await this.userRepository.save(user);

    delete user.password;

    return user;
  }

  async setUserRole(dto: RoleUpdateDto): Promise<User[]> {
    const response: User[] = [];
    const role = await this.roleRepository.findOneBy({ id: dto.roleId });
    if (!role) {
      throw new BadRequestException('Role not found.');
    }
    for (const userId of dto.userIds) {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        console.error(`User with ID ${userId} not found`);
        continue;
      }
      user.role = role;
      await this.userRepository.save(user);
      delete user.password;
      response.push(user);
    }
    return response;
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

  async getRole(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
