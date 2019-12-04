import {MigrationInterface, QueryRunner} from "typeorm";

export class default1575461360887 implements MigrationInterface {
    name = 'default1575461360887'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event_revision" DROP COLUMN "accepting"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_revision" DROP COLUMN "denying"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_revision" DROP COLUMN "spam"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_revision" ADD "conclusion" character varying`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event_revision" DROP COLUMN "conclusion"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_revision" ADD "spam" boolean`, undefined);
        await queryRunner.query(`ALTER TABLE "event_revision" ADD "denying" boolean`, undefined);
        await queryRunner.query(`ALTER TABLE "event_revision" ADD "accepting" boolean`, undefined);
    }

}
