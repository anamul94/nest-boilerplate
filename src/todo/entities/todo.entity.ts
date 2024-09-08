import { BaseEntity } from 'src/common/entity/base.entity';
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('todos')
export class Todo extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ name: 'f_name', type: 'varchar', length: 255 })
  f_name: string;

  @Column({ name: 'l_names', type: 'varchar', length: 255 })
  lastName: string;
}
