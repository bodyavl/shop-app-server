import { FindOneOptions } from 'typeorm';
import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { User } from '../../domain/user';

import { FilterUserDto, SortUserDto } from '../../dto/query-user.dto';
import { UserEntity } from './relational/entities/user.entity';

export abstract class UserRepository {
  abstract create(
    data: Omit<User, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<User>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]>;

  abstract findOne(
    options: FindOneOptions<UserEntity>,
  ): Promise<NullableType<User>>;

  abstract update(
    id: User['id'],
    payload: DeepPartial<User>,
  ): Promise<User | null>;

  abstract softDelete(id: User['id']): Promise<void>;
}
