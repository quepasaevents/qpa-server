import {MigrationInterface, QueryRunner} from "typeorm";

export class default1575054331894 implements MigrationInterface {
    name = 'default1575054331894'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "event_revision" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accepting" boolean NOT NULL, "denying" boolean NOT NULL, "spam" boolean NOT NULL, "comment" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "submittedAt" TIMESTAMP NOT NULL, "staleAt" TIMESTAMP NOT NULL, "authorId" uuid, "eventId" uuid, "dismissedById" uuid, CONSTRAINT "PK_47b1153961beb5c0dcbadb3a015" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD "pendingRevision" boolean`, undefined);
        await queryRunner.query(`UPDATE "event" set "pendingRevision"=False`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "pendingRevision" SET NOT NULL`, undefined);

        await queryRunner.query(`ALTER TABLE "event" ADD "publishedState" character varying`, undefined);
        await queryRunner.query(`UPDATE "event" set "publishedState"='published'`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "publishedState" SET NOT NULL`, undefined);

        await queryRunner.query(`ALTER TABLE "event" ADD "revisionState" character varying`, undefined);
        await queryRunner.query(`UPDATE "event" set "revisionState"='accepted'`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "revisionState" SET NOT NULL`, undefined);

        await queryRunner.query(`ALTER TABLE "event_revision" ADD CONSTRAINT "FK_dc462dee705a6ced9a970f8e7ba" FOREIGN KEY ("authorId") REFERENCES "app_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event_revision" ADD CONSTRAINT "FK_425cb7725e4aa21d2e818d40094" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event_revision" ADD CONSTRAINT "FK_e0cabdcd2ed083a061445e49b30" FOREIGN KEY ("dismissedById") REFERENCES "app_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event_revision" DROP CONSTRAINT "FK_e0cabdcd2ed083a061445e49b30"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_revision" DROP CONSTRAINT "FK_425cb7725e4aa21d2e818d40094"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_revision" DROP CONSTRAINT "FK_dc462dee705a6ced9a970f8e7ba"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "revisionState"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "publishedState"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "pendingRevision"`, undefined);
        await queryRunner.query(`DROP TABLE "event_revision"`, undefined);
    }

}
