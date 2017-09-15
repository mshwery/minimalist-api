/**
 * @overview renames the `description` column to `content`
 */

const tableName = 'task'
const oldColumnName = 'description'
const newColumnName = 'content'

exports.up = function (db) {
  return db.renameColumn(tableName, oldColumnName, newColumnName)
}

exports.down = function (db) {
  return db.renameColumn(tableName, newColumnName, oldColumnName)
}
