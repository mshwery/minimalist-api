/**
 * @overview creates the `user` table
 */

exports.up = function (db) {
  return db.createTable('users', {
    user_id: {
      type: 'uuid',
      primaryKey: true,
      defaultValue: new String('gen_random_uuid()')
    },
    email: {
      type: 'string',
      notNull: true,
      unique: true
    },
    password: {
      type: 'string',
      notNull: true
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      defaultValue: new String('now()')
    },
    updated_at: 'timestamp',
    deleted_at: 'timestamp'
  })
}

exports.down = function (db) {
  return db.dropTable('users')
}
