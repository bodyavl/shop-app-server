import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  SerializeOptions,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { infinityPagination } from '../utils/infinity-pagination';
import { Order } from './entities/order.entity';
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
@ApiTags('Admins Orders')
@Controller({
  path: 'admins/orders',
  version: '1',
})
export class OrdersAdminsController {
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

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number): Promise<void> {
    return this.ordersService.softDelete(id);
  }
}
