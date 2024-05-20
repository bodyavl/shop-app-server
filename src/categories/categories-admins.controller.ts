import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  SerializeOptions,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { infinityPagination } from '../utils/infinity-pagination';
import { Category } from './entities/category.entity';
import { NullableType } from '../utils/types/nullable.type';
import { QueryPaginationDto } from 'src/core/dto/query-pagination.dto';
import { AccessTokenGuard } from '../auth/guards/access.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { Product } from '../products/entities/product.entity';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AccessTokenGuard, RolesGuard)
@ApiTags('Admins Categories')
@Controller({
  path: 'admins/categories',
  version: '1',
})
export class CategoriesAdminsController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createDto);
  }

  @ApiOkResponse({
    type: InfinityPaginationResponse(Category),
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryPaginationDto<Category>,
  ): Promise<InfinityPaginationResponseDto<Category>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 250) {
      limit = 250;
    }

    return infinityPagination(
      await this.categoriesService.findManyWithPagination({
        filterOptions: query?.filters,
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
      await this.categoriesService.getMaximumPaginationPages({
        filterOptions: query?.filters,
        paginationOptions: { page, limit },
      }),
    );
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<NullableType<Category>> {
    return this.categoriesService.findOne({ id: +id });
  }

  @ApiOkResponse({
    type: Product,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: number,
    @Body() updateDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number): Promise<void> {
    return this.categoriesService.softDelete(id);
  }
}
