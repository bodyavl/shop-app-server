import { MigrationInterface, QueryRunner } from 'typeorm';

export class Stripe1725974549419 implements MigrationInterface {
  name = 'Stripe1725974549419';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "order" ("id" SERIAL NOT NULL, "amount" double precision NOT NULL DEFAULT '0', "currency" character varying NOT NULL DEFAULT 'USD', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_stripe" ("id" SERIAL NOT NULL, "price" double precision NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "parentOrderId" integer, CONSTRAINT "PK_f5cc89a1d0f4e3fe4820523ada5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_stripe" ADD CONSTRAINT "FK_827e60c197dce9e46a85b14277f" FOREIGN KEY ("parentOrderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_stripe" DROP CONSTRAINT "FK_827e60c197dce9e46a85b14277f"`,
    );
    await queryRunner.query(`DROP TABLE "payment_stripe"`);
    await queryRunner.query(`DROP TABLE "order"`);
  }
}
