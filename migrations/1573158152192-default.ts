import {MigrationInterface, QueryRunner} from "typeorm";

export class default1573158152192 implements MigrationInterface {
    name = 'default1573158152192'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event_information" DROP CONSTRAINT "FK_863d4c38d8fd413a088f4d74013"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_occurrence" DROP CONSTRAINT "FK_88f92a74a42d782cb5caa3993f5"`, undefined);
        await queryRunner.query(`CREATE TABLE "event_tags_event_tag" ("eventId" uuid NOT NULL, "eventTagId" uuid NOT NULL, CONSTRAINT "PK_3f47e72a5097b28b647b1297057" PRIMARY KEY ("eventId", "eventTagId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_0989b67502a6f750f18ac23723" ON "event_tags_event_tag" ("eventId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_d8af8d39511e6d008385a659ac" ON "event_tags_event_tag" ("eventTagId") `, undefined);
        await queryRunner.query(`ALTER TABLE "event_tag_translation" DROP CONSTRAINT "FK_39b53ca36e2fcbca8f1b3c0eb95"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_tag_translation" ALTER COLUMN "tagId" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "event_tag_translation" ADD CONSTRAINT "FK_39b53ca36e2fcbca8f1b3c0eb95" FOREIGN KEY ("tagId") REFERENCES "event_tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event_information" ADD CONSTRAINT "FK_863d4c38d8fd413a088f4d74013" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event_occurrence" ADD CONSTRAINT "FK_88f92a74a42d782cb5caa3993f5" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event_tags_event_tag" ADD CONSTRAINT "FK_0989b67502a6f750f18ac23723e" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event_tags_event_tag" ADD CONSTRAINT "FK_d8af8d39511e6d008385a659ac4" FOREIGN KEY ("eventTagId") REFERENCES "event_tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event_tags_event_tag" DROP CONSTRAINT "FK_d8af8d39511e6d008385a659ac4"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_tags_event_tag" DROP CONSTRAINT "FK_0989b67502a6f750f18ac23723e"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_occurrence" DROP CONSTRAINT "FK_88f92a74a42d782cb5caa3993f5"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_information" DROP CONSTRAINT "FK_863d4c38d8fd413a088f4d74013"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_tag_translation" DROP CONSTRAINT "FK_39b53ca36e2fcbca8f1b3c0eb95"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_tag_translation" ALTER COLUMN "tagId" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "event_tag_translation" ADD CONSTRAINT "FK_39b53ca36e2fcbca8f1b3c0eb95" FOREIGN KEY ("tagId") REFERENCES "event_tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_d8af8d39511e6d008385a659ac"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_0989b67502a6f750f18ac23723"`, undefined);
        await queryRunner.query(`DROP TABLE "event_tags_event_tag"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_occurrence" ADD CONSTRAINT "FK_88f92a74a42d782cb5caa3993f5" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event_information" ADD CONSTRAINT "FK_863d4c38d8fd413a088f4d74013" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

}
