import { Exclude } from '@nestjs/class-transformer';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Exclude()
  @Column({ type: 'varchar', length: 100, nullable: false })
  createdBy: string;

  @Exclude()
  @Column({ type: 'varchar', length: 100, nullable: true })
  updatedBy: string;
}
