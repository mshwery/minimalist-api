/**
 * @overview adds a `created_by` foreign key to the lists table
 */

const listsTable = 'lists'
const columnName = 'created_by'
const columnSpec = {
  type: 'uuid',
  notNull: true
}

const usersTable = 'users'
const foreignKeyName = 'lists_user_id_foreign'
const foreignKeyMapping = {
  'created_by': 'user_id'
}

const removalOptions = {
  dropIndex: true
}

exports.up = async function (db) {
  await db.addColumn(listsTable, columnName, columnSpec)
  return db.addForeignKey(listsTable, usersTable, foreignKeyName, foreignKeyMapping, {})
}

exports.down = async function (db) {
  await db.removeForeignKey(listsTable, foreignKeyName, removalOptions)
  return db.removeColumn(listsTable, columnName)
}
