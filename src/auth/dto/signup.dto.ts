import { ApiBody, ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  roleId?: Number;
}
