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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { infinityPagination } from '../utils/infinity-pagination';
import { Product } from './entities/product.entity';
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

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AccessTokenGuard, RolesGuard)
@ApiTags('Admins Products')
@Controller({
  path: 'admins/products',
  version: '1',
})
export class ProductsAdminsController {
  constructor(private readonly productsService: ProductsService) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createDto);
  }

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

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<NullableType<Product>> {
    return this.productsService.findOne({ id: +id });
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: number,
    @Body() updateDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number): Promise<void> {
    return this.productsService.softDelete(id);
  }
}
