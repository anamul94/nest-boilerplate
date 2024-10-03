import { Tokens } from './types/token.type';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Request,
  Res,
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
  ApiCookieAuth,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { User } from 'src/user/entities';
import { Public } from './decorators';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@ApiBearerAuth()
@ApiCookieAuth()
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
  async login(@Request() req, @Res() res): Promise<Tokens> {
    const tokens = await this.authService.login(req.user);
    res.cookie('Bearer', tokens.access_token);
    return res.send(tokens);
  }

  @ApiCookieAuth('Bearer')
  @Get('/logout/:token')
  @ApiOkResponse({ type: String, description: 'Logout successful' })
  async logout(
    @Req() req,
    @Res({ passthrough: true }) res,
  ): Promise<{ message: string }> {
    const token = req.params.token; // This is set by JwtAuthGuards
    console.log(req.cookies);
    // const token = req.cookies['Bearer'];
    await this.authService.logout(token);
    res.clearCookie('Bearer', { httpOnly: true, secure: true });
    return { message: 'Logged out successfully' };
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

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Req() req) {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  facebookAuthRedirect(@Req() req) {
    console.log('faceboo');
    return req.user;
  }
}
