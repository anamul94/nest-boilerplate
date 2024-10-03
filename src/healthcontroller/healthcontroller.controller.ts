import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthcontrollerController {
  @Get()
  check() {
    return 'OK';
  }
}
