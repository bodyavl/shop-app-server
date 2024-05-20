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
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { NullableType } from '../utils/types/nullable.type';
import { getEntityRelations } from 'src/utils/get-entity-relations';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesRepository.save(
      this.categoriesRepository.create(createDto),
    );
  }

  getMaximumPaginationPages({
    filterOptions,
    paginationOptions,
  }: {
    filterOptions?: FindOptionsWhere<Category>;
    paginationOptions: IPaginationOptions;
  }): Promise<number> {
    return this.categoriesRepository
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
    filterOptions?: FindOptionsWhere<Category>;
    sortOptions?: FindOptionsOrder<Category>;
    paginationOptions: IPaginationOptions;
  }): Promise<Category[]> {
    return this.categoriesRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: filterOptions,
      order: sortOptions,
      relations: getEntityRelations(Category),
    });
  }

  findOne(fields: EntityCondition<Category>): Promise<NullableType<Category>> {
    return this.categoriesRepository.findOne({
      where: fields,
      relations: getEntityRelations(Category),
    });
  }

  update(
    id: Category['id'],
    payload: DeepPartial<Category>,
  ): Promise<Category> {
    return this.categoriesRepository.save(
      this.categoriesRepository.create({
        id,
        ...payload,
      }),
    );
  }

  async softDelete(id: Category['id']): Promise<void> {
    await this.categoriesRepository.softDelete(id);
  }
}
