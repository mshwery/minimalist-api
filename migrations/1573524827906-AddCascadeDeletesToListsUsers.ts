import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm'

const foreignKeys = [
  new TableForeignKey({
    columnNames: ['listId'],
    referencedColumnNames: ['id'],
    referencedTableName: 'lists',
    onDelete: 'CASCADE'
  }),
  new TableForeignKey({
    columnNames: ['userId'],
    referencedColumnNames: ['id'],
    referencedTableName: 'users',
    onDelete: 'CASCADE'
  })
]

export class AddCascadeDeletesToListsUsers1573524827906 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = await queryRunner.getTable('lists_users')
    if (table) {
      await queryRunner.dropForeignKeys('lists_users', table.foreignKeys)
      await queryRunner.createForeignKeys('lists_users', foreignKeys)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const table = await queryRunner.getTable('lists_users')
    if (table) {
      await queryRunner.dropForeignKeys('lists_users', table.foreignKeys)
      await queryRunner.createForeignKeys('lists_users', foreignKeys.map(fk => {
        delete fk.onDelete
        return fk
      }))
    }
  }
}
