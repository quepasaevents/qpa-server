import {MigrationInterface, QueryRunner} from "typeorm";

export class default1564644703824 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL DEFAULT 'confirmed', "ownerId" uuid, "timeTimezone" character varying NOT NULL, "timeStart" character varying NOT NULL, "timeEnd" character varying NOT NULL, "timeRecurrence" character varying, "timeExceptions" character varying, "metaTags" character varying array NOT NULL, "locationAddress" character varying, "locationName" character varying, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_information" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "language" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying, "eventId" uuid, CONSTRAINT "PK_98dd4865bbd8ee9baa0d350bfea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_occurrence" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "during" tstzrange, "start" character varying NOT NULL, "end" character varying NOT NULL, "eventId" uuid NOT NULL, CONSTRAINT "PK_15f3eaeafc7a718d56affa41212" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "app_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3fa909d0e37c531ebc237703391" UNIQUE ("email"), CONSTRAINT "PK_22a5c4a3d9b2fb8e4e73fc4ada1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "session" ("id" SERIAL NOT NULL, "isValid" boolean NOT NULL, "hash" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "session_invite" ("id" SERIAL NOT NULL, "hash" character varying NOT NULL, "timeValidated" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_4066458385c05cde8a6fd1ef201" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_e4abcb418e46db776e920a05a16" FOREIGN KEY ("ownerId") REFERENCES "app_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_information" ADD CONSTRAINT "FK_863d4c38d8fd413a088f4d74013" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_occurrence" ADD CONSTRAINT "FK_88f92a74a42d782cb5caa3993f5" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "app_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "session_invite" ADD CONSTRAINT "FK_7cc1874bcc9924a2a0a78443907" FOREIGN KEY ("userId") REFERENCES "app_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "session_invite" DROP CONSTRAINT "FK_7cc1874bcc9924a2a0a78443907"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`);
        await queryRunner.query(`ALTER TABLE "event_occurrence" DROP CONSTRAINT "FK_88f92a74a42d782cb5caa3993f5"`);
        await queryRunner.query(`ALTER TABLE "event_information" DROP CONSTRAINT "FK_863d4c38d8fd413a088f4d74013"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_e4abcb418e46db776e920a05a16"`);
        await queryRunner.query(`DROP TABLE "session_invite"`);
        await queryRunner.query(`DROP TABLE "session"`);
        await queryRunner.query(`DROP TABLE "app_user"`);
        await queryRunner.query(`DROP TABLE "event_occurrence"`);
        await queryRunner.query(`DROP TABLE "event_information"`);
        await queryRunner.query(`DROP TABLE "event"`);
    }

}
