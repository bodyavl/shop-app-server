import { MigrationInterface, QueryRunner } from 'typeorm';

export class Price1716807315266 implements MigrationInterface {
  name = 'Price1716807315266';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ADD "price" double precision NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "price"`);
  }
}
