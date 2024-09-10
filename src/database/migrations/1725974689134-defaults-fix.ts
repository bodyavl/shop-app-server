import { MigrationInterface, QueryRunner } from 'typeorm';

export class DefaultsFix1725974689134 implements MigrationInterface {
  name = 'DefaultsFix1725974689134';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "currency" SET DEFAULT 'usd'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "currency" SET DEFAULT 'USD'`,
    );
  }
}
