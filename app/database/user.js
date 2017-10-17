/**
 * @overview users database interface
 */

/* eslint-disable camelcase */

const SQL = require('sql-template-strings')
const db = require('./connection')
const { hashPassword } = require('../lib/auth')

async function get (userId) {
  const query = SQL`
    select
      user_id,
      email,
      created_at,
      updated_at
    from
      users
    where
      user_id = ${userId}
      and deleted_at is null
    limit 1
  `

  return db.getOne(query)
}

async function create ({ email, password }) {
  const hashedPassword = await hashPassword(password)

  const query = SQL`
    insert into users (
      email,
      password
    )
    values (
      ${email},
      ${hashedPassword}
    )
    returning
      user_id,
      email,
      created_at,
      updated_at
  `

  return db.getOne(query)
}

async function update (userId, { email, password }) {
  const hashedPassword = hashPassword(password)

  const query = SQL`
    update users
    set
      email = ${email},
      password = ${hashedPassword},
      updated_at = ${new Date()}
    where
      user_id = ${userId}
      and deleted_at is null
    returning
      user_id,
      email
      created_at,
      updated_at
  `

  return db.getOne(query)
}

async function destroy (userId) {
  // @todo use `update` query once it handles partial column attrs?
  const query = SQL`
    update users
    set
      deleted_at = ${new Date()}
    where
      user_id = ${userId}
    returning
      user_id
  `

  return db.getOne(query)
}

async function findByEmail (email) {
  const query = SQL`
    select
      user_id,
      email,
      password,
      created_at,
      updated_at
    from
      users
    where
      email = ${email}
      and deleted_at is null
    limit 1
  `

  return db.getOne(query)
}

module.exports = {
  get,
  create,
  update,
  destroy,
  findByEmail
}
