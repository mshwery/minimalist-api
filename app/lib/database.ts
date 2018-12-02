import { createConnection, Connection, ConnectionOptions } from 'typeorm'
import * as ormConfig from '../../ormconfig'
import { List } from '../models/list'
import { Task } from '../models/task'
import { User } from '../models/user'

const connectionOptions: ConnectionOptions = {
  ...(ormConfig as ConnectionOptions),
  entities: [List, Task, User]
}

export default function initConnection(): Promise<Connection> {
  return createConnection(connectionOptions as ConnectionOptions)
}
