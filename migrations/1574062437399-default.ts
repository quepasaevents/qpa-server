import {MigrationInterface, QueryRunner} from "typeorm";

export class default1574062437399 implements MigrationInterface {
    name = 'default1574062437399'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event_tag_translation" DROP CONSTRAINT "FK_39b53ca36e2fcbca8f1b3c0eb95"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_tag_translation" ADD CONSTRAINT "FK_39b53ca36e2fcbca8f1b3c0eb95" FOREIGN KEY ("tagId") REFERENCES "event_tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event_tag_translation" DROP CONSTRAINT "FK_39b53ca36e2fcbca8f1b3c0eb95"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_tag_translation" ADD CONSTRAINT "FK_39b53ca36e2fcbca8f1b3c0eb95" FOREIGN KEY ("tagId") REFERENCES "event_tag"("id")`, undefined);
    }

}
