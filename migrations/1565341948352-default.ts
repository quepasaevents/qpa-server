import {MigrationInterface, QueryRunner} from "typeorm"

export class default1565341948352 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user_role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_fb2e442d14add3cefbdf33c4561" PRIMARY KEY ("id"))`)
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_ab40a6f0cd7d3ebfcce082131fd" FOREIGN KEY ("userId") REFERENCES "app_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_ab40a6f0cd7d3ebfcce082131fd"`)
        await queryRunner.query(`DROP TABLE "user_role"`)
    }

}
