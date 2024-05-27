import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import { RelationUUIDDto } from 'src/core/dto/relation-uuid.dto';
import { FileEntity } from '../../files/infrastructure/persistence/relational/entities/file.entity';
import { Category } from '../../categories/entities/category.entity';
import { RelationDto } from '../../core/dto/relation.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ type: () => FileEntity })
  @Type(() => RelationUUIDDto)
  @ValidateNested({ each: true })
  @IsOptional()
  photo?: Partial<FileEntity> | null;

  @ApiProperty({ type: () => FileEntity })
  @Type(() => RelationDto)
  @ValidateNested({ each: true })
  @IsOptional()
  category?: Category;
}
