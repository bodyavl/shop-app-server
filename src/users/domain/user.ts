import { Exclude, Expose } from 'class-transformer';
import { FileType } from '../../files/domain/file';
import { Role } from '../../roles/domain/role';
import { Status } from '../../statuses/domain/status';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities/product.entity';

const idType = Number;

export class User {
  @ApiResponseProperty({
    type: idType,
  })
  id: number;

  @ApiResponseProperty({
    type: String,
    example: 'john.doe@example.com',
  })
  @Expose({ groups: ['me', 'admin'] })
  email: string | null;

  @Exclude({ toPlainOnly: true })
  password?: string;

  @Exclude({ toPlainOnly: true })
  previousPassword?: string;

  @ApiResponseProperty({
    type: String,
    example: 'email',
  })
  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @ApiResponseProperty({
    type: String,
    example: '1234567890',
  })
  @Expose({ groups: ['me', 'admin'] })
  socialId?: string | null;

  @ApiResponseProperty({
    type: String,
    example: 'John',
  })
  firstName: string | null;

  @ApiResponseProperty({
    type: String,
    example: 'Doe',
  })
  lastName: string | null;

  @ApiResponseProperty({
    type: () => FileType,
  })
  photo?: FileType | null;

  @ApiResponseProperty({
    type: () => Role,
  })
  role?: Role | null;

  @ApiResponseProperty({
    type: () => Status,
  })
  status?: Status;

  @ApiResponseProperty({ type: [Product] })
  cart?: Product[];

  @ApiResponseProperty({ type: [Product] })
  viewed?: Product[];

  @ApiResponseProperty({ type: [Product] })
  wishlist?: Product[];

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;

  @ApiResponseProperty()
  deletedAt: Date;
}
