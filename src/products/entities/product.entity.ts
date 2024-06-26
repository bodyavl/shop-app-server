import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { FileEntity } from '../../files/infrastructure/persistence/relational/entities/file.entity';
import { EntityRelationalHelper } from '../../utils/relational-entity-helper';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Category } from '../../categories/entities/category.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Product extends EntityRelationalHelper {
  @ApiResponseProperty({
    example: 1,
    type: Number,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiResponseProperty({
    example: 'Product name',
    type: String,
  })
  @Column()
  name: string;

  @ApiResponseProperty()
  @Expose({ groups: ['detailed'] })
  @Column({ nullable: true })
  description?: string;

  @ApiResponseProperty()
  @Column({ type: 'double precision', default: 0 })
  price: number;

  @ApiResponseProperty({
    type: () => FileEntity,
  })
  @ManyToOne(() => FileEntity, { cascade: true, nullable: true })
  photo?: FileEntity | null;

  @ApiResponseProperty({
    type: () => Category,
  })
  @ManyToOne(() => Category)
  category?: Category | null;

  @ApiResponseProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiResponseProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiResponseProperty()
  @DeleteDateColumn()
  deletedAt: Date;
}
