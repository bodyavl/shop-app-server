import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { EntityRelationalHelper } from '../../utils/relational-entity-helper';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class Order extends EntityRelationalHelper {
  @ApiResponseProperty({
    example: 1,
    type: Number,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiResponseProperty()
  @Column({ type: 'double precision', default: 0 })
  amount: number;

  @ApiResponseProperty()
  @Column({ default: 'usd' })
  currency: string;

  @ApiResponseProperty({
    type: () => Product,
  })
  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];

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
