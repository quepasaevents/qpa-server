import {MigrationInterface, QueryRunner} from "typeorm";

export class default1570719082786 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event_information" DROP CONSTRAINT "FK_863d4c38d8fd413a088f4d74013"`);
        await queryRunner.query(`ALTER TABLE "event_occurrence" DROP CONSTRAINT "FK_88f92a74a42d782cb5caa3993f5"`);
        await queryRunner.query(`ALTER TABLE "event_information" ADD CONSTRAINT "FK_863d4c38d8fd413a088f4d74013" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_occurrence" ADD CONSTRAINT "FK_88f92a74a42d782cb5caa3993f5" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event_occurrence" DROP CONSTRAINT "FK_88f92a74a42d782cb5caa3993f5"`);
        await queryRunner.query(`ALTER TABLE "event_information" DROP CONSTRAINT "FK_863d4c38d8fd413a088f4d74013"`);
        await queryRunner.query(`ALTER TABLE "event_occurrence" ADD CONSTRAINT "FK_88f92a74a42d782cb5caa3993f5" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_information" ADD CONSTRAINT "FK_863d4c38d8fd413a088f4d74013" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
