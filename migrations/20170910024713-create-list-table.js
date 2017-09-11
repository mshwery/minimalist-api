/**
 * @overview creates the `list` table with initial columns
 */

exports.up = function (db) {
  return Promise.all([
    db.createTable('list', {
      list_id: {
        type: 'uuid',
        primaryKey: true,
        defaultValue: new String('gen_random_uuid()')
      },
      name: 'string',
      created_at: {
        type: 'timestamp',
        notNull: true,
        defaultValue: new String('now()')
      },
      updated_at: 'timestamp',
      deleted_at: 'timestamp'
    }),
    db.createTable('task', {
      task_id: {
        type: 'uuid',
        primaryKey: true,
        defaultValue: new String('gen_random_uuid()')
      },
      description: 'string',
      completed_at: 'timestamp',
      created_at: {
        type: 'timestamp',
        notNull: true,
        defaultValue: new String('now()')
      },
      updated_at: 'timestamp',
      deleted_at: 'timestamp'
    })
  ])
}

exports.down = function (db) {
  return Promise.all([
    db.dropTable('list'),
    db.dropTable('task')
  ])
}
