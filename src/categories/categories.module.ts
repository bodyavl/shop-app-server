import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsExist } from '../utils/validators/is-exists.validator';
import { IsNotExist } from '../utils/validators/is-not-exists.validator';
import { Category } from './entities/category.entity';
import { CategoriesAdminsController } from './categories-admins.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController, CategoriesAdminsController],
  providers: [IsExist, IsNotExist, CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
