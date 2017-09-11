/**
 * @overview list database interface
 */

const SQL = require('sql-template-strings')
const db = require('./connection')

const defaultList = {
  name: 'Unnamed List'
}

async function all () {
  const query = SQL`
    select
      list_id,
      name,
      created_at,
      updated_at
    from
      list
    where
      deleted_at is null
  `

  const { rows } = await db.query(query)
  return rows
}

async function get (listId) {
  const query = SQL`
    select
      list_id,
      name,
      created_at,
      updated_at
    from
      list
    where
      list_id = ${listId}
      and deleted_at is null
  `

  const { rows } = await db.query(query)
  return rows[0]
}

async function create (list = defaultList) {
  const query = SQL`
    insert into list (
      name
    )
    values (
      ${list.name}
    )
    returning
      list_id,
      name,
      created_at,
      updated_at
  `

  const { rows } = await db.query(query)
  return rows[0]
}

async function update (listId, list = {}) {
  const query = SQL`
    update list
    set
      name = ${list.name}
    where
      list_id = ${listId}
      and deleted_at is null
    returning
      list_id,
      name,
      created_at,
      updated_at
  `

  const { rows } = await db.query(query)
  return rows[0]
}

async function destroy (listId) {
  // @todo use `update` query once it handles partial column attrs
  const query = SQL`
    update list
    set
      deleted_at = ${new Date()}
    where
      list_id = ${listId}
    returning
      list_id
  `

  const { rows } = await db.query(query)
  return rows[0]
}

module.exports = {
  all,
  get,
  create,
  update,
  destroy
}
