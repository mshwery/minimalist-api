import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

const googleIdColumn = new TableColumn({
  name: 'googleId',
  type: 'text',
  isNullable: true
})

export class AddGoogleIdToUsers1555823291713 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn('users', googleIdColumn)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('users', googleIdColumn)
  }
}
