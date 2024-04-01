import { UsersService } from 'src/user/user.service';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuards } from 'src/auth/guards';
import { Role, RoleNames, User } from './entities';
import { Public } from 'src/auth/decorators';
import { RoleUpdateDto } from './dto/role.update.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  @Patch()
  @ApiBody({ type: UpdateUserDto })
  updateUser(@Request() req, @Body() dto: UpdateUserDto): Promise<User> {
    return this.UsersService.updateUser(req.user.sub, dto);
  }

  @Patch('/set-role')
  test(@Request() req, @Body() dto: RoleUpdateDto): Promise<User[]> {
    if (req.user.role === RoleNames.ADMIN) {
      return this.UsersService.setUserRole(dto);
    }
    throw new UnauthorizedException();
  }
}
