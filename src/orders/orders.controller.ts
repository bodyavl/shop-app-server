import {
  Controller,
  Get,
  Param,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  SerializeOptions,
  Body,
  Post,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { infinityPagination } from '../utils/infinity-pagination';
import { Order } from './entities/order.entity';
import { NullableType } from '../utils/types/nullable.type';
import { QueryPaginationDto } from 'src/core/dto/query-pagination.dto';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OptionalAccessTokenGuard } from '../auth/guards/optional-access.guard';

@ApiBearerAuth()
@UseGuards(OptionalAccessTokenGuard)
@ApiTags('Orders')
@Controller({
  path: 'orders',
  version: '1',
})
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createDto);
  }

  @ApiOkResponse({
    type: InfinityPaginationResponse(Order),
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryPaginationDto<Order>,
  ): Promise<InfinityPaginationResponseDto<Order>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 250) {
      limit = 250;
    }

    return infinityPagination(
      await this.ordersService.findManyWithPagination({
        filterOptions: query?.filters,
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
      await this.ordersService.getMaximumPaginationPages({
        filterOptions: query?.filters,
        paginationOptions: { page, limit },
      }),
    );
  }

  @ApiOkResponse({
    type: Order,
  })
  @SerializeOptions({
    groups: ['detailed'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<NullableType<Order>> {
    return this.ordersService.findOne({ id: +id });
  }
}
