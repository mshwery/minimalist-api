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
      *
    from
      list
  `

  const { rows } = await db.query(query)
  return rows
}

async function get (listId) {
  const query = SQL`
    select
      *
    from
      list
    where
      list_id = ${listId}
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
    returning *
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
    returning *
  `

  const { rows } = await db.query(query)
  return rows[0]
}

async function destroy (listId) {
  const query = SQL`
    delete from list
    where
      list_id = ${listId}
    returning list_id
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
