/**
 * @overview list database interface
 */

/* eslint-disable camelcase */

const SQL = require('sql-template-strings')
const { NotFound } = require('http-errors')
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
function toListModel (list) {
  return list && {
    ...list,
    archived: !!list.archived_at
  }
}

async function validateUserAccess (listId, userId) {
  const list = await get(listId, userId)

  if (!list) {
    throw new NotFound(`No list found with id = '${listId}'`)
  }
}

async function all (userId, { archived }) {
  const query = SQL`
    select
      list_id,
      name,
      created_at,
      updated_at,
      archived_at
    from
      lists
    where
      created_by = ${userId}
      and deleted_at is null
  `

  if (archived === 'true') {
    query.append(SQL` and archived_at is not null `)
  } else if (archived === 'false') {
    query.append(SQL` and archived_at is null `)
  }

  const { rows } = await db.query(query)
  return rows.map(toListModel)
}

async function get (listId, userId) {
  const query = SQL`
    select
      list_id,
      name,
      created_at,
      updated_at,
      archived_at
    from
      lists
    where
      list_id = ${listId}
      and created_by = ${userId}
      and deleted_at is null
    limit 1
  `

  return db.getOne(query).then(toListModel)
}

async function create (list = defaultList, userId) {
  const query = SQL`
    insert into lists (
      name,
      created_by
    )
    values (
      ${list.name},
      ${userId}
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

async function update (listId, userId, list = {}) {
  const query = SQL`
    update lists
    set
      name = ${list.name},
      updated_at = ${new Date()}
    where
      list_id = ${listId}
      and created_by = ${userId}
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

async function destroy (listId, userId) {
  await validateUserAccess(listId, userId)

  const now = new Date()

  // @todo use `update` query once it handles partial column attrs?
  const deleteTasksQuery = SQL`
    update tasks
    set
      deleted_at = ${now}
    where
      list_id = ${listId}
      and deleted_at is null
  `

  const deleteListQuery = SQL`
    update lists
    set
      deleted_at = ${now}
    where
      list_id = ${listId}
      and created_by = ${userId}
    returning
      list_id
  `

  await db.transaction(async (client) => {
    // delete the list(s)
    await client.query(deleteListQuery)

    // delete the tasks
    await client.query(deleteTasksQuery)
  })

  return listId
}

async function archive (listId, userId) {
  // @todo use `update` query once it handles partial column attrs?
  const query = SQL`
    update lists
    set
      archived_at = ${new Date()},
      updated_at = ${new Date()}
    where
      list_id = ${listId}
      and created_by = ${userId}
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

async function unarchive (listId, userId) {
  // @todo use `update` query once it handles partial column attrs?
  const query = SQL`
    update lists
    set
      archived_at = null,
      updated_at = ${new Date()}
    where
      list_id = ${listId}
      and created_by = ${userId}
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
  archive,
  unarchive,
  validateUserAccess
}
