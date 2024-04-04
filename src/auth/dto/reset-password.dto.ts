import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty()
  oldPassword: string;

  @ApiProperty()
  newPassword: string;
}
