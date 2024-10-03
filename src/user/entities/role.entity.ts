import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ERole } from './role.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Role {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: Number;

  @ApiProperty()
  @Column({ type: 'enum', enum: ERole })
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
