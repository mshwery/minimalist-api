import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitDb1543724416561 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" text NOT NULL, "password" text NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "users" ("email") `)
    await queryRunner.query(
      `CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "listId" uuid, "completedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "lists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "archivedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_d8feafd203525d5f9c37b3ed3b9" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_d2275fe92da6a114d70796b7344" FOREIGN KEY ("listId") REFERENCES "lists"("id") ON DELETE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_0d5ad69a41a534dea0c786e7a6f" FOREIGN KEY ("createdBy") REFERENCES "users"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "lists" ADD CONSTRAINT "FK_f7d43219a7f54fdacf73df3ed78" FOREIGN KEY ("createdBy") REFERENCES "users"("id")`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "lists" DROP CONSTRAINT "FK_f7d43219a7f54fdacf73df3ed78"`)
    await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_0d5ad69a41a534dea0c786e7a6f"`)
    await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_d2275fe92da6a114d70796b7344"`)
    await queryRunner.query(`DROP TABLE "lists"`)
    await queryRunner.query(`DROP TABLE "tasks"`)
    await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`)
    await queryRunner.query(`DROP TABLE "users"`)
  }
}
