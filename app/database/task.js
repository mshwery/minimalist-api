/**
 * @overview task database interface
 */

/* eslint-disable camelcase */

const SQL = require('sql-template-strings')
const db = require('./connection')

const defaultTask = {
  content: ''
}

/**
 * Homogenize the shape of a task with some derived values
 * @param {Object} attrs - task attributes
 * @returns {Object} the external representation of a task including derived data / convenience properties
 * @todo evaluate returning create/update dates on any models... are they useful? maybe not if we have "order" properties
 */
function toTaskModel ({ completed_at, ...attrs }) {
  return {
    ...attrs,
    completed: !!completed_at,
    completed_at
  }
}

async function all ({ list_id, completed }) {
  const query = SQL`
    select
      task_id,
      list_id,
      content,
      completed_at,
      created_at,
      updated_at
    from
      task
    where
      deleted_at is null
  `

  if (list_id) {
    query.append(SQL` and list_id = ${list_id} `)
  }

  if (completed === 'true') {
    query.append(SQL` and completed_at is not null `)
  } else if (completed === 'false') {
    query.append(SQL` and completed_at is null `)
  }

  const { rows } = await db.query(query)
  return rows.map(toTaskModel)
}

async function get (taskId) {
  const query = SQL`
    select
      task_id,
      list_id,
      content,
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

async function create ({ content, list_id, completed_at }) {
  // @todo support passing in the `task_id` and other properties
  const task = {
    ...defaultTask,
    list_id,
    content,
    completed_at
  }

  const query = SQL`
    insert into task (
      list_id,
      content
    )
    values (
      ${task.list_id || null},
      ${task.content}
    )
    returning
      task_id,
      list_id,
      content,
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

  const task = Object.assign({}, oldTask, newTask)

  const query = SQL`
    update task
    set
      list_id = ${task.list_id},
      content = ${task.content},
      updated_at = ${new Date()}
    where
      task_id = ${taskId}
      and deleted_at is null
    returning
      task_id,
      list_id,
      content,
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
      list_id,
      content,
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
      list_id,
      content,
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
