import {MigrationInterface, QueryRunner} from "typeorm";

export class default1565333799392 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "app_user" ALTER COLUMN "username" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "app_user" ALTER COLUMN "username" SET NOT NULL`);
    }

}
