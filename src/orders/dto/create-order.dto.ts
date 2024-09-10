import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RelationDto } from '../../core/dto/relation.dto';
import { Product } from '../../products/entities/product.entity';

export class CreateOrderDto {
  @ApiProperty({ type: () => [Product] })
  @Type(() => RelationDto)
  @ValidateNested({ each: true })
  @IsOptional()
  products: Product[];

  amount?: number;
}
