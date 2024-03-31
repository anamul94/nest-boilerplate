import { ApiBody, ApiProperty } from '@nestjs/swagger';
import { RoleNames } from 'src/users/entities';

export class SignupDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ enum: RoleNames })
  roleId?: string;
}
