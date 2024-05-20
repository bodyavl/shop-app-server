import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import {
  DeepPartial,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { NullableType } from '../utils/types/nullable.type';
import { getEntityRelations } from 'src/utils/get-entity-relations';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createDto: CreateProductDto): Promise<Product> {
    return this.productsRepository.save(
      this.productsRepository.create(createDto),
    );
  }

  getMaximumPaginationPages({
    filterOptions,
    paginationOptions,
  }: {
    filterOptions?: FindOptionsWhere<Product>;
    paginationOptions: IPaginationOptions;
  }): Promise<number> {
    return this.productsRepository
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
    filterOptions?: FindOptionsWhere<Product>;
    sortOptions?: FindOptionsOrder<Product>;
    paginationOptions: IPaginationOptions;
  }): Promise<Product[]> {
    return this.productsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: filterOptions,
      order: sortOptions,
      relations: getEntityRelations(Product),
    });
  }

  findOne(fields: EntityCondition<Product>): Promise<NullableType<Product>> {
    return this.productsRepository.findOne({
      where: fields,
      relations: getEntityRelations(Product),
    });
  }

  update(id: Product['id'], payload: DeepPartial<Product>): Promise<Product> {
    return this.productsRepository.save(
      this.productsRepository.create({
        id,
        ...payload,
      }),
    );
  }

  async softDelete(id: Product['id']): Promise<void> {
    await this.productsRepository.softDelete(id);
  }
}
