import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleNames } from './role-names.enum';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('increment')
  id: Number;

  @Column({ type: 'enum', enum: RoleNames })
  roleName: string;

  // @OneToMany(() => User, (user) => user.role)
  // users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
