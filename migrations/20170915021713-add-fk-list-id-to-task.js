/**
 * @overview adds a `list_id` foreign key `task` table
 * This applies a `ON DELETE SET NULL` rule, such that orphaned tasks (when a list is deleted) are still around
 * This is particularly useful if we want a generic "inbox" kind of catch-all for any tasks that belong to no list
 */

const table = 'task'
const columnName = 'list_id'
const columnSpec = {
  type: 'uuid'
}

const referencedColumn = 'list_id'
const referencedTable = 'list'
const foreignKeyName = 'task_list_id_foreign_key'
const fieldMapping = { [columnName]: referencedColumn }
const rules = { onDelete: 'SET NULL' }

exports.up = function (db) {
  return db.addColumn(table, columnName, columnSpec).then(() => {
    return db.addForeignKey(table, referencedTable, foreignKeyName, fieldMapping, rules)
  })
}

exports.down = function (db) {
  return db.removeForeignKey(table, foreignKeyName).then(() => {
    return db.removeColumn(table, columnName)
  })
}
