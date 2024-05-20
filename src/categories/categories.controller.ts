import {
  Controller,
  Get,
  Param,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  SerializeOptions,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { infinityPagination } from '../utils/infinity-pagination';
import { Category } from './entities/category.entity';
import { NullableType } from '../utils/types/nullable.type';
import { QueryPaginationDto } from 'src/core/dto/query-pagination.dto';
import { OptionalAccessTokenGuard } from 'src/auth/guards/optional-access.guard';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { Product } from '../products/entities/product.entity';

@ApiBearerAuth()
@UseGuards(OptionalAccessTokenGuard)
@ApiTags('Categories')
@Controller({
  path: 'categories',
  version: '1',
})
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

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

  @ApiOkResponse({
    type: Product,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<NullableType<Category>> {
    return this.categoriesService.findOne({ id: +id });
  }
}
