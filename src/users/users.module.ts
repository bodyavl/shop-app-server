import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';

import { UsersService } from './users.service';
import { RelationalUserPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { FilesModule } from '../files/files.module';
import { ProductsModule } from '../products/products.module';

const infrastructurePersistenceModule = RelationalUserPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule, FilesModule, ProductsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, infrastructurePersistenceModule],
})
export class UsersModule {}
