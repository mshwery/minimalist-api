import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

const imageColumn = new TableColumn({
  name: 'image',
  type: 'text',
  isNullable: true,
})

const nameColumn = new TableColumn({
  name: 'name',
  type: 'text',
  isNullable: true,
})

export class AddImageToUsers1556069886897 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumns('users', [imageColumn, nameColumn])
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumns('users', [imageColumn, nameColumn])
  }
}
