import { UsersService } from 'src/user/user.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuards } from 'src/auth/guards';
import { Role } from './entities';
import { Public } from 'src/auth/decorators';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuards)
@Controller('user')
export class UserController {
  constructor(private readonly UsersService: UsersService) {}

  @Public()
  @Get('/role')
  getRole(): Promise<Role[]> {
    return this.UsersService.getRole();
  }

  @Get('/test')
  test(): string {
    return 'test';
  }
}
