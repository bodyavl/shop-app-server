import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { PaymentStripe } from './entities/payment-stripe.entity';
import { NullableType } from '../utils/types/nullable.type';
import { getEntityRelations } from 'src/utils/get-entity-relations';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class PaymentsStripeService {
  private client: Stripe;
  constructor(
    @InjectRepository(PaymentStripe)
    private paymentsStripeRepository: Repository<PaymentStripe>,
    private configService: ConfigService<AllConfigType>,
  ) {
    this.client = new Stripe(
      configService.getOrThrow('stripe.secretKey', { infer: true }),
    );
  }

  webhook(data: any): void {
    console.log('[WEBHOOK DATA]', data);
  }

  async create(order: Order) {
    // const backendDomain = this.configService.get('app.backendDomain', {
    //   infer: true,
    // });

    const frontendDomain = this.configService.get('app.frontendDomain', {
      infer: true,
    });

    const checkout = await this.client.checkout.sessions.create({
      mode: 'payment',
      line_items: order.products.map((item) => {
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
            },
            unit_amount: item.price * 100,
          },
          quantity: 1,
        };
      }),
      success_url: frontendDomain + `/orders/success/${order.id}`,
    });
    const created = await this.paymentsStripeRepository.save(
      this.paymentsStripeRepository.create({
        price: order.products.reduce((acc, item) => acc + item.price, 0),
      }),
    );

    return { ...created, url: checkout.url };
  }

  getMaximumPaginationPages({
    filterOptions,
    paginationOptions,
  }: {
    filterOptions?: FindOptionsWhere<PaymentStripe>;
    paginationOptions: IPaginationOptions;
  }): Promise<number> {
    return this.paymentsStripeRepository
      .count({
        where: filterOptions,
      })
      .then((count) => Math.ceil(count / paginationOptions.limit));
  }

  findOne(
    fields: EntityCondition<PaymentStripe>,
  ): Promise<NullableType<PaymentStripe>> {
    return this.paymentsStripeRepository.findOne({
      where: fields,
      relations: getEntityRelations(PaymentStripe),
    });
  }

  update(
    id: PaymentStripe['id'],
    payload: DeepPartial<PaymentStripe>,
  ): Promise<PaymentStripe> {
    return this.paymentsStripeRepository.save(
      this.paymentsStripeRepository.create({
        id,
        ...payload,
      }),
    );
  }

  async softDelete(id: PaymentStripe['id']): Promise<void> {
    await this.paymentsStripeRepository.softDelete(id);
  }
}
