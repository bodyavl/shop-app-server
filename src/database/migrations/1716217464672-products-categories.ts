import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductsCategories1716217464672 implements MigrationInterface {
  name = 'ProductsCategories1716217464672';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "photoId" uuid, "categoryId" integer, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_cart_product" ("userId" integer NOT NULL, "productId" integer NOT NULL, CONSTRAINT "PK_7c2694c4fe5e07b62031b7ab38d" PRIMARY KEY ("userId", "productId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_859740a85160363bb2a209639a" ON "user_cart_product" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_091b205df9cb27704d16b1fbaf" ON "user_cart_product" ("productId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_viewed_product" ("userId" integer NOT NULL, "productId" integer NOT NULL, CONSTRAINT "PK_69c71e7709fdd549257c35bd580" PRIMARY KEY ("userId", "productId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_55d0142eaa68608e8f9e758921" ON "user_viewed_product" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_998e524965a8e79363c0f58822" ON "user_viewed_product" ("productId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_wishlist_product" ("userId" integer NOT NULL, "productId" integer NOT NULL, CONSTRAINT "PK_8a0ba8732386fb9b3d0e64c32c8" PRIMARY KEY ("userId", "productId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_564ccb987cd7c2ec3a104c80cc" ON "user_wishlist_product" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8963db183e429d3ff0e4684c94" ON "user_wishlist_product" ("productId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_2910df1471f6bf34df891d72e17" FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_cart_product" ADD CONSTRAINT "FK_859740a85160363bb2a209639a9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_cart_product" ADD CONSTRAINT "FK_091b205df9cb27704d16b1fbaff" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_viewed_product" ADD CONSTRAINT "FK_55d0142eaa68608e8f9e758921e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_viewed_product" ADD CONSTRAINT "FK_998e524965a8e79363c0f58822b" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_wishlist_product" ADD CONSTRAINT "FK_564ccb987cd7c2ec3a104c80cc5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_wishlist_product" ADD CONSTRAINT "FK_8963db183e429d3ff0e4684c940" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_wishlist_product" DROP CONSTRAINT "FK_8963db183e429d3ff0e4684c940"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_wishlist_product" DROP CONSTRAINT "FK_564ccb987cd7c2ec3a104c80cc5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_viewed_product" DROP CONSTRAINT "FK_998e524965a8e79363c0f58822b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_viewed_product" DROP CONSTRAINT "FK_55d0142eaa68608e8f9e758921e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_cart_product" DROP CONSTRAINT "FK_091b205df9cb27704d16b1fbaff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_cart_product" DROP CONSTRAINT "FK_859740a85160363bb2a209639a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_2910df1471f6bf34df891d72e17"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8963db183e429d3ff0e4684c94"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_564ccb987cd7c2ec3a104c80cc"`,
    );
    await queryRunner.query(`DROP TABLE "user_wishlist_product"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_998e524965a8e79363c0f58822"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_55d0142eaa68608e8f9e758921"`,
    );
    await queryRunner.query(`DROP TABLE "user_viewed_product"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_091b205df9cb27704d16b1fbaf"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_859740a85160363bb2a209639a"`,
    );
    await queryRunner.query(`DROP TABLE "user_cart_product"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "category"`);
  }
}
