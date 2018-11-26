import { createConnection, Connection, ConnectionOptions } from 'typeorm'
import * as ormConfig from '../../ormconfig'

const connectionOptions: ConnectionOptions = {
  ...(ormConfig as ConnectionOptions),
  entities: []
}

export default function initConnection(): Promise<Connection> {
  return createConnection(connectionOptions as ConnectionOptions)
}
