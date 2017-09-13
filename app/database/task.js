/**
 * @overview task database interface
 */

const SQL = require('sql-template-strings')
const db = require('./connection')

const defaultTask = {
  description: ''
}

/**
 * Homogenize the shape of a task with some derived values
 * @param {Object} attrs - task attributes
 * @returns {Object} the external representation of a task including derived data / convenience properties
 * @todo evaluate returning create/update dates on any models... are they useful? maybe not if we have "order" properties
 */
function toTaskModel ({ completed_at, archived_at, ...attrs }) {
  return {
    ...attrs,
    // eslint-disable-next-line camelcase
    completed: !!completed_at,
    completed_at
  }
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
  return rows.map(toTaskModel)
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
    limit 1
  `

  return db.getOne(query).then(toTaskModel)
}

async function create (task = defaultTask) {
  const query = SQL`
    insert into task (
      description
    )
    values (
      ${task.description}
    )
    returning
      task_id,
      description,
      completed_at,
      created_at,
      updated_at
  `

  return db.getOne(query).then(toTaskModel)
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
      description = ${task.description},
      updated_at = ${new Date()}
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

  return db.getOne(query).then(toTaskModel)
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

  return db.getOne(query).then(toTaskModel)
}

// @todo revisit name of method – it's synonymous with "completed"
async function close (taskId) {
  // @todo use `update` query once it handles partial column attrs?
  // @todo throw error when trying to close/complete an already completed task?
  const query = SQL`
    update task
    set
      completed_at = ${new Date()},
      updated_at = ${new Date()}
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

  return db.getOne(query).then(toTaskModel)
}

async function reopen (taskId) {
  // @todo use `update` query once it handles partial column attrs?
  const query = SQL`
    update task
    set
      completed_at = null,
      updated_at = ${new Date()}
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

  return db.getOne(query).then(toTaskModel)
}

module.exports = {
  all,
  get,
  create,
  update,
  destroy,
  close,
  reopen
}
