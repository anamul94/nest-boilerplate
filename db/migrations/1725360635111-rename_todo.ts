import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTodo1725360635111 implements MigrationInterface {
    name = 'RenameTodo1725360635111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" RENAME COLUMN "l_name" TO "l_names"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" RENAME COLUMN "l_names" TO "l_name"`);
    }

}
