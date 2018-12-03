import { createConnection, Connection, ConnectionOptions } from 'typeorm'
import * as ormConfig from '../../ormconfig'
import { List } from '../models/list'
import { Task } from '../models/task'
import { User } from '../models/user'

const defaultOptions: ConnectionOptions = {
  ...(ormConfig as ConnectionOptions),
  entities: [List, Task, User]
}

export default function initConnection(options: Partial<ConnectionOptions> = {}): Promise<Connection> {
  return createConnection({
    ...defaultOptions,
    ...options
  } as ConnectionOptions)
}
