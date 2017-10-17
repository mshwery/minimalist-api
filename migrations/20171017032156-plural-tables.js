/**
 * @overview creates the `user` table
 */

exports.up = function (db) {
  return Promise.all([
    db.renameTable('list', 'lists'),
    db.renameTable('task', 'tasks')
  ])
}

exports.down = function (db) {
  return Promise.all([
    db.renameTable('lists', 'list'),
    db.renameTable('tasks', 'task')
  ])
}
