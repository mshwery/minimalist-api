import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

const dueColumn = new TableColumn({
  name: 'due',
  type: 'timestamp with time zone',
  isNullable: true,
})

export class AddDueDateToTasks1575482104279 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn('tasks', dueColumn)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('tasks', dueColumn)
  }
}
