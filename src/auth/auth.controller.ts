import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuards, LocalAuthGuard } from './guards';
import { Tokens } from './types';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { User } from 'src/user/entities';
import { Public } from './decorators';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiBody({ type: SignupDto })
  signUp(@Body() dto: SignupDto): Promise<User> {
    console.log(dto);
    return this.authService.signUp(dto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBody({ type: LoginDto })
  login(@Request() req): Promise<Tokens> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuards)
  @Get('/profile')
  getProfile(@Request() req): any {
    return req.user;
  }
}
