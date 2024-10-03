import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/user/user.service';
import { Role, ERole, User } from 'src/user/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User])],
  providers: [UsersService, ConfigService],
})
export class InitModule implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.initRoles();
  }

  private async initRoles() {
    for (const roleName of Object.values(ERole)) {
      const existingRole = await this.usersService.getRoleByName(roleName);
      if (!existingRole) {
        await this.usersService.createRole(roleName);
        console.log(`Role ${roleName} created.`);
      }
    }
  }
}
