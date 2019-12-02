import {MigrationInterface, QueryRunner} from "typeorm";

export class default1575309306182 implements MigrationInterface {
    name = 'default1575309306182'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event_revision" ALTER COLUMN "accepting" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "event_revision" ALTER COLUMN "denying" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "event_revision" ALTER COLUMN "spam" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "event_revision" ALTER COLUMN "comment" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "event_revision" ALTER COLUMN "submittedAt" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "event_revision" ALTER COLUMN "staleAt" DROP NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event_revision" ALTER COLUMN "staleAt" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "event_revision" ALTER COLUMN "submittedAt" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "event_revision" ALTER COLUMN "comment" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "event_revision" ALTER COLUMN "spam" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "event_revision" ALTER COLUMN "denying" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "event_revision" ALTER COLUMN "accepting" SET NOT NULL`, undefined);
    }

}
