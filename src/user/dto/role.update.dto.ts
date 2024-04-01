import { ApiProperty } from '@nestjs/swagger';

export class RoleUpdateDto {
  @ApiProperty()
  roleId: Number;

  @ApiProperty()
  userIds: [string];
}
