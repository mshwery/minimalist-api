import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

const newPasswordColumn = new TableColumn({
  name: 'password',
  type: 'text',
  isNullable: true,
})

const oldPasswordColumn = new TableColumn({
  name: 'password',
  type: 'text',
  isNullable: false,
})

export class NullablePasswords1555791390726 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn('users', 'password', newPasswordColumn)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn('users', 'password', oldPasswordColumn)
  }
}
