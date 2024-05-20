import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class RelationUUIDDto {
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @IsUUID()
  id: string;
}
