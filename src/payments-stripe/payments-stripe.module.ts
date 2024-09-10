import { Module } from '@nestjs/common';
import { PaymentsStripeService } from './payments-stripe.service';
import { PaymentsStripeController } from './payments-stripe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsExist } from '../utils/validators/is-exists.validator';
import { IsNotExist } from '../utils/validators/is-not-exists.validator';
import { PaymentStripe } from './entities/payment-stripe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentStripe])],
  controllers: [PaymentsStripeController],
  providers: [IsExist, IsNotExist, PaymentsStripeService],
  exports: [PaymentsStripeService],
})
export class PaymentsStripeModule {}
