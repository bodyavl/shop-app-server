import { ApiProperty } from '@nestjs/swagger';
import { IsObject, isObject, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import {
  Between,
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
  In,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import { isIsoDate } from 'src/utils/is-iso-date';

export class QueryDto<
  T,
  F = FindOptionsWhere<T> | FindOptionsWhere<T>[],
  S = FindOptionsOrder<T>,
> {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsObject()
  @TransformFilters()
  filters?: F;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    return value ? JSON.parse(value) : undefined;
  })
  sort?: S;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  search?: string;
}

function TransformFilters() {
  return Transform(({ value }) => {
    const parsed = value ? JSON.parse(value) : undefined;
    if (!parsed) {
      return undefined;
    }

    for (const [key, value] of Object.entries(parsed)) {
      if (parsed[key]?.from && parsed[key]?.to) {
        parsed[key] = Between(
          new Date(parsed[key]?.from),
          new Date(parsed[key]?.to),
        );
        continue;
      } else if (parsed[key]?.from && !parsed[key]?.to) {
        parsed[key] = MoreThanOrEqual(new Date(parsed[key]?.from));
        continue;
      } else if (parsed[key]?.to && !parsed[key]?.from) {
        parsed[key] = LessThanOrEqual(new Date(parsed[key]?.to));
        continue;
      }

      if (value === null) {
        parsed[key] = IsNull();
      }
      if (typeof value === 'string' && !isIsoDate(value)) {
        console.log('value 1', value);
        parsed[key] = ILike(`%${value}%`);
      }

      if (isObject(value)) {
        for (const [subKey, subValue] of Object.entries(parsed[key])) {
          console.log('subValue', subValue);
          if (subValue instanceof Array) {
            const isStingArray = subValue.every((item) => !isObject(item));
            if (isStingArray) {
              parsed[key][subKey] = In(subValue);
              continue;
            }
          }
          if (typeof subValue === 'string' && !isIsoDate(subValue)) {
            console.log('value 2', subValue);

            parsed[key][subKey] = ILike(`%${subValue}%`);
          }
        }
      }
      if (value instanceof Array) {
        const isStingArray = value.every((item) => !isObject(item));
        if (isStingArray) {
          parsed[key] = In(value);
          continue;
        }
        for (const arrayItem of value) {
          if (typeof arrayItem === 'object') {
            for (const [subKey, subValue] of Object.entries(arrayItem)) {
              if (typeof subValue === 'string' && !isIsoDate(subValue)) {
                console.log('value 3', subValue);

                arrayItem[subKey] = ILike(`%${subValue}%`);
              }
            }
          }
        }
      }
    }

    console.log(parsed);

    return parsed;
  });
}
