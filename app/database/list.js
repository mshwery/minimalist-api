/**
 * @overview list database interface
 */

/* eslint-disable camelcase */

const SQL = require('sql-template-strings')
const db = require('./connection')

const defaultList = {
  name: 'Unnamed List'
}

/**
 * Homogenize the shape of a list with some derived values
 * @param {Object} attrs - list attributes
 * @returns {Object} the external representation of a list including derived data / convenience properties
 * @todo evaluate returning create/update dates on any models... are they useful?
 */
function toListModel ({ archived_at, ...attrs }) {
  return {
    ...attrs,
    archived: !!archived_at,
    archived_at
  }
}

async function all ({ archived }) {
  const query = SQL`
    select
      list_id,
      name,
      created_at,
      updated_at,
      archived_at
    from
      list
    where
      deleted_at is null
  `

  if (archived === 'true') {
    query.append(SQL` and archived_at is not null `)
  } else if (archived === 'false') {
    query.append(SQL` and archived_at is null `)
  }

  const { rows } = await db.query(query)
  return rows.map(toListModel)
}

async function get (listId) {
  const query = SQL`
    select
      list_id,
      name,
      created_at,
      updated_at,
      archived_at
    from
      list
    where
      list_id = ${listId}
      and deleted_at is null
    limit 1
  `

  return db.getOne(query).then(toListModel)
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
      updated_at,
      archived_at
  `

  return db.getOne(query).then(toListModel)
}

async function update (listId, list = {}) {
  // @todo throw error when trying to update a deleted list?
  const query = SQL`
    update list
    set
      name = ${list.name},
      updated_at = ${new Date()}
    where
      list_id = ${listId}
      and deleted_at is null
    returning
      list_id,
      name,
      created_at,
      updated_at,
      archived_at
  `

  return db.getOne(query).then(toListModel)
}

async function destroy (listId) {
  // @todo use `update` query once it handles partial column attrs?
  const query = SQL`
    update list
    set
      deleted_at = ${new Date()}
    where
      list_id = ${listId}
    returning
      list_id
  `

  return db.getOne(query).then(toListModel)
}

async function archive (listId) {
  // @todo use `update` query once it handles partial column attrs?
  // @todo throw error when trying to archive a deleted list?
  const query = SQL`
    update list
    set
      archived_at = ${new Date()}
    where
      list_id = ${listId}
      and deleted_at is null
    returning
      list_id,
      name,
      created_at,
      updated_at,
      archived_at
  `

  return db.getOne(query).then(toListModel)
}

module.exports = {
  all,
  get,
  create,
  update,
  destroy,
  archive
}
