exports.up = function (db) {
  return Promise.all([
    db.runSql(`
      CREATE TRIGGER set_updated_at
      BEFORE UPDATE ON list
      FOR EACH ROW
      EXECUTE PROCEDURE trigger_set_updated_at();
    `),
    db.runSql(`
      CREATE TRIGGER set_updated_at
      BEFORE UPDATE ON task
      FOR EACH ROW
      EXECUTE PROCEDURE trigger_set_updated_at();
    `)
  ])
}

exports.down = function (db) {
  return Promise.all([
    db.runSql(`
      DROP TRIGGER set_updated_at ON list
    `),
    db.runSql(`
      DROP TRIGGER set_updated_at ON task
    `)
  ])
}
