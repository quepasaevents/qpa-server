import {MigrationInterface, QueryRunner} from "typeorm";

export class default1575557500612 implements MigrationInterface {
    name = 'default1575557500612'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event_revision" DROP CONSTRAINT "FK_425cb7725e4aa21d2e818d40094"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_revision" ADD CONSTRAINT "FK_425cb7725e4aa21d2e818d40094" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event_revision" DROP CONSTRAINT "FK_425cb7725e4aa21d2e818d40094"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_revision" ADD CONSTRAINT "FK_425cb7725e4aa21d2e818d40094" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
