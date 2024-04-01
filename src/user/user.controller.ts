import { UsersService } from 'src/user/user.service';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Patch,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuards } from 'src/auth/guards';
import { Role, RoleNames, User } from './entities';
import { Public } from 'src/auth/decorators';
import { RoleUpdateDto } from './dto/role.update.dto';

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

  @Patch('/set-role')
  test(@Request() req, @Body() dto: RoleUpdateDto): Promise<User[]> {
    if (req.user.role === RoleNames.ADMIN) {
      return this.UsersService.setUserRole(dto);
    }
    throw new UnauthorizedException();
  }
}
