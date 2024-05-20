import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import { RelationUUIDDto } from 'src/core/dto/relation-uuid.dto';
import { FileEntity } from '../../files/infrastructure/persistence/relational/entities/file.entity';
import { RelationDto } from '../../core/dto/relation.dto';
import { Category } from '../../categories/entities/category.entity';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: () => FileEntity })
  @Type(() => RelationUUIDDto)
  @ValidateNested({ each: true })
  @IsOptional()
  photo?: Partial<FileEntity> | null;

  @ApiProperty({ type: () => FileEntity })
  @Type(() => RelationDto)
  @ValidateNested({ each: true })
  @IsNotEmpty()
  category: Category;
}
