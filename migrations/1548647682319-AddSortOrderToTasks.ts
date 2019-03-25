import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

const sortOrderColumn = new TableColumn({
  name: 'sortOrder',
  type: 'integer',
  isNullable: true
})

export class AddSortOrderToTask1548647682319 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn('tasks', sortOrderColumn)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('tasks', sortOrderColumn)
  }
}
