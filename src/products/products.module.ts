import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsExist } from '../utils/validators/is-exists.validator';
import { IsNotExist } from '../utils/validators/is-not-exists.validator';
import { Product } from './entities/product.entity';
import { ProductsAdminsController } from './products-admins.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController, ProductsAdminsController],
  providers: [IsExist, IsNotExist, ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
