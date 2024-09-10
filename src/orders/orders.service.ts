import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import {
  DeepPartial,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { NullableType } from '../utils/types/nullable.type';
import { getEntityRelations } from 'src/utils/get-entity-relations';
import { PaymentsStripeService } from '../payments-stripe/payments-stripe.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private paymentsStripeService: PaymentsStripeService,
  ) {}

  async create(createDto: CreateOrderDto): Promise<Order> {
    const created = await this.ordersRepository.save(
      this.ordersRepository.create({
        ...createDto,
        amount: createDto.amount ?? 10,
      }),
    );

    const order = await this.ordersRepository.findOne({
      where: { id: created.id },
      relations: getEntityRelations(Order),
    });

    if (!order) {
      throw new HttpException(
        {
          errors: {
            order: 'Order Not Found',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    await this.paymentsStripeService.create(order);

    return created;
  }

  getMaximumPaginationPages({
    filterOptions,
    paginationOptions,
  }: {
    filterOptions?: FindOptionsWhere<Order>;
    paginationOptions: IPaginationOptions;
  }): Promise<number> {
    return this.ordersRepository
      .count({
        where: filterOptions,
      })
      .then((count) => Math.ceil(count / paginationOptions.limit));
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FindOptionsWhere<Order>;
    sortOptions?: FindOptionsOrder<Order>;
    paginationOptions: IPaginationOptions;
  }): Promise<Order[]> {
    return this.ordersRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: filterOptions,
      order: sortOptions,
      relations: getEntityRelations(Order),
    });
  }

  findOne(fields: EntityCondition<Order>): Promise<NullableType<Order>> {
    return this.ordersRepository.findOne({
      where: fields,
      relations: getEntityRelations(Order),
    });
  }

  update(id: Order['id'], payload: DeepPartial<Order>): Promise<Order> {
    return this.ordersRepository.save(
      this.ordersRepository.create({
        id,
        ...payload,
      }),
    );
  }

  async softDelete(id: Order['id']): Promise<void> {
    await this.ordersRepository.softDelete(id);
  }
}
