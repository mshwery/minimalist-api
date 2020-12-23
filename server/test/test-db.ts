import path from 'path'
import { ConnectionOptions, Connection } from 'typeorm'
import initConnection from '../src/lib/database'
import config from '../config'

const options: Partial<ConnectionOptions> = {
  migrations: [path.resolve(__dirname, `../migrations/*.ts`)],
  port: Number(config.get('TEST_PGPORT') || 5436),
  database: 'minimalist_test',
}

/**
 * Creates a connection to the db (will be used in each test suite)
 */
export function createConnection(): Promise<Connection> {
  return initConnection(options)
}

/**
 * Initializes a connection to our test db, drops everything and runs migrations (so each test run will start from scratch)
 * This allows you to ignore migrating the test db manually, too
 */
export async function resetDb() {
  // TODO: investigate dropping the entire schema on every test?
  const connection: Connection = await createConnection()
  await connection.dropDatabase()
  await connection.runMigrations({ transaction: 'all' })

  // Close this connection since each test suite will init and close its own connection
  await connection.close()

  console.log('Successfully cleared db and ran migrations')
}
