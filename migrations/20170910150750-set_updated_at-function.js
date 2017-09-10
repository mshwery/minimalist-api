exports.up = function (db) {
  return db.runSql(`
    CREATE OR REPLACE FUNCTION trigger_set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `)
}

exports.down = function (db) {
  return db.runSql(`
    DROP FUNCTION IF EXISTS trigger_set_updated_at();
  `)
}
