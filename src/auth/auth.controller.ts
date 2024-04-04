import { Tokens } from './types/token.type';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuards, LocalAuthGuard } from './guards';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { User } from 'src/user/entities';
import { Public } from './decorators';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiBody({ type: SignupDto })
  @ApiOkResponse({ type: User })
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
  @Patch('/reset-password')
  @ApiBody({ type: ResetPasswordDto })
  @ApiOkResponse({ type: String })
  resetPassword(
    @Request() req,
    @Body() dto: ResetPasswordDto,
  ): Promise<string> {
    console.log(req.user);
    return this.authService.resetPassword(req.user.email, dto);
  }
}
