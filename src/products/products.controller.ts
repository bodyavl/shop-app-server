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
import { ProductsService } from './products.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { infinityPagination } from '../utils/infinity-pagination';
import { Product } from './entities/product.entity';
import { NullableType } from '../utils/types/nullable.type';
import { QueryPaginationDto } from 'src/core/dto/query-pagination.dto';
import { OptionalAccessTokenGuard } from 'src/auth/guards/optional-access.guard';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';

@ApiBearerAuth()
@UseGuards(OptionalAccessTokenGuard)
@ApiTags('Products')
@Controller({
  path: 'products',
  version: '1',
})
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOkResponse({
    type: InfinityPaginationResponse(Product),
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryPaginationDto<Product>,
  ): Promise<InfinityPaginationResponseDto<Product>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 250) {
      limit = 250;
    }

    return infinityPagination(
      await this.productsService.findManyWithPagination({
        filterOptions: query?.filters,
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
      await this.productsService.getMaximumPaginationPages({
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
  findOne(@Param('id') id: string): Promise<NullableType<Product>> {
    return this.productsService.findOne({ id: +id });
  }
}
