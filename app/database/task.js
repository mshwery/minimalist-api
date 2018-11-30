/**
 * @overview task database interface
 */

/* eslint-disable camelcase */

const SQL = require('sql-template-strings')
const db = require('./connection')
const List = require('./list')

const defaultTask = {
  content: ''
}

/**
 * Homogenize the shape of a task with some derived values
 * @param {Object} attrs - task attributes
 * @returns {Object} the external representation of a task including derived data / convenience properties
 * @todo evaluate returning create/update dates on any models... are they useful? maybe not if we have "order" properties
 */
function toTaskModel (task) {
  return task && {
    ...task,
    completed: !!task.completed_at
  }
}

async function all ({ list_id, completed }, userId) {
  const query = SQL`
    select
      tasks.task_id,
      tasks.list_id,
      tasks.content,
      tasks.completed_at,
      tasks.created_at,
      tasks.updated_at
    from
      tasks
    inner join lists
      on lists.list_id = tasks.list_id
      and lists.deleted_at is null
      and lists.created_by = ${userId}
      and tasks.deleted_at is null
  `

  if (completed === 'true') {
    query.append(SQL` and tasks.completed_at is not null `)
  } else if (completed === 'false') {
    query.append(SQL` and tasks.completed_at is null `)
  }

  if (list_id) {
    await List.validateUserAccess(list_id, userId)
    query.append(SQL` and tasks.list_id = ${list_id} `)
  }

  const { rows } = await db.query(query)
  return rows.map(toTaskModel)
}

async function get (taskId, userId) {
  // no need to validate access to the list because this query will simply not return an item
  const query = SQL`
    select
      tasks.task_id,
      tasks.list_id,
      tasks.content,
      tasks.completed_at,
      tasks.created_at,
      tasks.updated_at
    from
      tasks
    inner join lists
      on lists.list_id = tasks.list_id
      and lists.deleted_at is null
      and lists.created_by = ${userId}
      and tasks.task_id = ${taskId}
      and tasks.deleted_at is null
    limit 1
  `

  return db.getOne(query).then(toTaskModel)
}

async function create ({ content, list_id, completed_at }, userId) {
  // @todo support passing in the `task_id` and other properties
  const task = {
    ...defaultTask,
    list_id,
    content,
    completed_at
  }

  await List.validateUserAccess(list_id, userId)

  const query = SQL`
    insert into tasks (
      list_id,
      content
    )
    values (
      ${task.list_id},
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

async function update (taskId, newAttrs = {}, userId) {
  // `get` handles access control to the task (based on list access)
  const task = await get(taskId, userId)

  if (!task) {
    return null
  }

  const attrs = Object.assign({}, task, newAttrs)

  const query = SQL`
    update tasks
    set
      list_id = ${attrs.list_id},
      content = ${attrs.content},
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

async function destroy (taskId, userId) {
  // `get` handles access control to the task (based on list access)
  const task = await get(taskId, userId)

  if (!task) {
    return null
  }

  // @todo use `update` query once it handles partial column attrs
  const query = SQL`
    update tasks
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
async function close (taskId, userId) {
  // `get` handles access control to the task (based on list access)
  const task = await get(taskId, userId)

  if (!task) {
    return null
  }

  // @todo use `update` query once it handles partial column attrs?
  // @todo throw error when trying to close/complete an already completed task?
  const query = SQL`
    update tasks
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

async function reopen (taskId, userId) {
  // `get` handles access control to the task (based on list access)
  const task = await get(taskId, userId)

  if (!task) {
    return null
  }

  // @todo use `update` query once it handles partial column attrs?
  const query = SQL`
    update tasks
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
