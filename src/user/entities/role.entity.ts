import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleNames } from './role-names.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Role {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: Number;

  @ApiProperty()
  @Column({ type: 'enum', enum: RoleNames })
  roleName: string;

  // @OneToMany(() => User, (user) => user.role)
  // users: User[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
