import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

const ListsUsers = new Table({
  name: 'lists_users',
  columns: [
    {
      name: 'listId',
      type: 'uuid',
      isNullable: false,
      isPrimary: true
    },
    {
      name: 'userId',
      type: 'uuid',
      isNullable: false,
      isPrimary: true
    }
  ],
  foreignKeys: [
    new TableForeignKey({
      columnNames: ['listId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'lists'
    }),
    new TableForeignKey({
      columnNames: ['userId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users'
    })
  ],
  indices: [
    {
      columnNames: ['listId', 'userId'],
      isUnique: true
    }
  ]
})

export class CreateListsUsersTable1573521910560 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(ListsUsers, true)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(ListsUsers, true)
  }
}
