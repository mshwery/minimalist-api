import { Connection } from 'typeorm'
import { createConnection } from './test-db'

let connection: Connection | undefined

// Each test suite needs init a connection
beforeAll(async () => {
  connection = await createConnection()
})

// And then close it
afterAll(async () => {
  if (connection) {
    await connection.close()
  }
})
