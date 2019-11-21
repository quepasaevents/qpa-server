import {MigrationInterface, QueryRunner} from "typeorm";

export class default1574344750420 implements MigrationInterface {
    name = 'default1574344750420'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event_information" DROP CONSTRAINT "FK_863d4c38d8fd413a088f4d74013"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_occurrence" DROP CONSTRAINT "FK_88f92a74a42d782cb5caa3993f5"`, undefined);
        await queryRunner.query(`CREATE TABLE "event_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "url" character varying NOT NULL, "eventId" uuid, CONSTRAINT "UQ_e0730670db410441fb315c033ba" UNIQUE ("url"), CONSTRAINT "PK_4b28dce817e9888b5a9c8f301d2" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "event_image" ADD CONSTRAINT "FK_aa30911418fb972511203b0f7a0" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event_information" ADD CONSTRAINT "FK_863d4c38d8fd413a088f4d74013" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event_occurrence" ADD CONSTRAINT "FK_88f92a74a42d782cb5caa3993f5" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event_occurrence" DROP CONSTRAINT "FK_88f92a74a42d782cb5caa3993f5"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_information" DROP CONSTRAINT "FK_863d4c38d8fd413a088f4d74013"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_image" DROP CONSTRAINT "FK_aa30911418fb972511203b0f7a0"`, undefined);
        await queryRunner.query(`DROP TABLE "event_image"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_occurrence" ADD CONSTRAINT "FK_88f92a74a42d782cb5caa3993f5" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event_information" ADD CONSTRAINT "FK_863d4c38d8fd413a088f4d74013" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

}
