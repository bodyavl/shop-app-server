import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { EntityRelationalHelper } from '../../utils/relational-entity-helper';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class PaymentStripe extends EntityRelationalHelper {
  @ApiResponseProperty({
    example: 1,
    type: Number,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiResponseProperty()
  @Column({ type: 'double precision', default: 0 })
  price: number;

  @ApiResponseProperty({
    type: () => Order,
  })
  @ManyToOne(() => Order)
  parentOrder: Order;

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
