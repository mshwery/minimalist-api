import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

const itemOrderColumn = new TableColumn({
  name: 'itemOrder',
  type: 'integer',
  isGenerated: true,
  generationStrategy: 'increment',
  isNullable: false
})

export class AddItemOrderToTask1548647682319 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn('task', itemOrderColumn)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('task', itemOrderColumn)
  }
}
