import { Tokens } from './types/token.type';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleGuard, JwtAuthGuards, LocalAuthGuard } from './guards';
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
import { ForgotPasswordDto } from './dto/forgot-password.dto';

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

  @Get('/google-oauth')
  @UseGuards(GoogleGuard)
  async googleAuth(@Request() req) {}

  @Get('/google-oauth/callback')
  @UseGuards(GoogleGuard)
  googleAuthRedirect(@Request() req) {
    return this.authService.googleAuth(req);
  }

  @UseGuards(JwtAuthGuards)
  @Patch('/reset-password')
  @ApiBody({ type: ResetPasswordDto })
  @ApiOkResponse({ type: String })
  resetPassword(
    @Request() req,
    @Body() dto: ResetPasswordDto,
  ): Promise<string> {
    return this.authService.resetPassword(req.user.email, dto);
  }

  @Public()
  @Post('/:email/forgot-password')
  async sendMail(@Param('email') email: string) {
    try {
      await this.authService.genForgotPasswordOtp(email);
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Public()
  @Post('/:email/:otp/validate-otp')
  async validateOTP(@Param('email') email: string, @Param('otp') otp: string) {
    try {
      const isValid = await this.authService.validateOTP(email, otp);
      return {
        success: isValid,
        message: isValid ? 'OTP is valid' : 'OTP is invalid',
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Public()
  @Post('/set-new-password')
  async setNewPassword(@Body() dto: ForgotPasswordDto): Promise<string> {
    return this.authService.setNewPassword(dto);
  }
}
