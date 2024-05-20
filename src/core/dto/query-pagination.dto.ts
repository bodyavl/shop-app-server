import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

import { FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { QueryDto } from './query.dto';

export class QueryPaginationDto<
  T,
  F = FindOptionsWhere<T>,
  S = FindOptionsOrder<T>,
> extends QueryDto<T, F, S> {
  @ApiProperty({
    required: false,
  })
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiProperty({
    required: false,
  })
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit: number;
}
