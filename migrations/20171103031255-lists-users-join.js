/**
 * @overview creates the `lists_users` join table and foreign key references
 */

const tableName = 'lists_users'
const listsTable = 'lists'
const usersTable = 'users'
const listsForeignKeyName = 'lists_users_list_id_foreign'
const usersForeignKeyName = 'lists_users_user_id_foreign'
const rules = {
  onDelete: 'CASCADE'
}

const listsMapping = {
  'list_id': 'list_id'
}

const usersMapping = {
  'user_id': 'user_id'
}

const removalOptions = {
  dropIndex: true
}

exports.up = async function (db) {
  await db.createTable(tableName, {
    user_id: {
      type: 'uuid',
      notNull: true
    },
    list_id: {
      type: 'uuid',
      notNull: true
    }
  })

  return Promise.all([
    db.addForeignKey(tableName, usersTable, usersForeignKeyName, usersMapping, rules),
    db.addForeignKey(tableName, listsTable, listsForeignKeyName, listsMapping, rules)
  ])
}

exports.down = async function (db) {
  await Promise.all([
    db.removeForeignKey(tableName, usersForeignKeyName, removalOptions),
    db.removeForeignKey(tableName, listsForeignKeyName, removalOptions)
  ])

  return db.dropTable(tableName)
}
