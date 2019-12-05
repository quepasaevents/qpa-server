import {MigrationInterface, QueryRunner} from "typeorm";

export class default1575473781515 implements MigrationInterface {
    name = 'default1575473781515'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event_revision" ADD "lastChangedAt" TIMESTAMP NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event_revision" DROP COLUMN "lastChangedAt"`, undefined);
    }

}
