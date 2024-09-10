import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsExist } from '../utils/validators/is-exists.validator';
import { IsNotExist } from '../utils/validators/is-not-exists.validator';
import { Order } from './entities/order.entity';
import { OrdersAdminsController } from './orders-admins.controller';
import { PaymentsStripeModule } from '../payments-stripe/payments-stripe.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), PaymentsStripeModule],
  controllers: [OrdersController, OrdersAdminsController],
  providers: [IsExist, IsNotExist, OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
