/**
 * @overview task database interface
 */

const SQL = require('sql-template-strings')
const db = require('./connection')

const defaultTask = {
  description: ''
}

async function all (taskId) {
  const query = SQL`
    select
      task_id,
      description,
      completed_at,
      created_at,
      updated_at
    from
      task
    where
      deleted_at is null
  `

  const { rows } = await db.query(query)
  return rows
}

async function get (taskId) {
  const query = SQL`
    select
      task_id,
      description,
      completed_at,
      created_at,
      updated_at
    from
      task
    where
      task_id = ${taskId}
      and deleted_at is null
  `

  const { rows } = await db.query(query)
  return rows[0]
}

async function create (task = defaultTask) {
  const query = SQL`
    insert into task (
      name
    )
    values (
      ${task.name}
    )
    returning
      task_id,
      description,
      completed_at,
      created_at,
      updated_at
  `

  const { rows } = await db.query(query)
  return rows[0]
}

async function update (taskId, newTask = {}) {
  const oldTask = await get(taskId)

  if (!oldTask) {
    return null
  }

  // @todo only update the props that have been provided?
  const task = Object.assign({}, oldTask, newTask)

  const query = SQL`
    update task
    set
      description = ${task.description}
    where
      task_id = ${taskId}
      and deleted_at is null
    returning
      task_id,
      description,
      completed_at,
      created_at,
      updated_at
  `

  const { rows } = await db.query(query)
  return rows[0]
}

async function destroy (taskId) {
  // @todo use `update` query once it handles partial column attrs
  const query = SQL`
    update task
    set
      deleted_at = ${new Date()}
    where
      task_id = ${taskId}
    returning
      task_id
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
