import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
