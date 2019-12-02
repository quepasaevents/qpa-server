import {MigrationInterface, QueryRunner} from "typeorm";

export class default1575278799818 implements MigrationInterface {
    name = 'default1575278799818'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "pendingRevision"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event" ADD "pendingRevision" boolean NOT NULL`, undefined);
    }

}
