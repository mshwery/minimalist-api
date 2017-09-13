/**
 * @overview adds an `archived_at` timestamp to the `list` table
 */

exports.up = function (db) {
  return db.addColumn('list', 'archived_at', { type: 'timestamp' })
}

exports.down = function (db) {
  return db.removeColumn('list', 'archived_at')
}
