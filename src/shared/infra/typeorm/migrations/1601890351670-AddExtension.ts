import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddExtension1601890351670 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public`,
    );
  }
}
