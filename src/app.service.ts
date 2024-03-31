import { Injectable } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

@Injectable()
export class AppService {
  constructor(private authService: AuthService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async login(user: any) {
    return this.authService.login(user);
  }
}
