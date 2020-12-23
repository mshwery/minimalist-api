import { createConnection, Connection, ConnectionOptions } from 'typeorm'
import ormConfig from '../../ormconfig'
import List from '../models/list/list.entity'
import Task from '../models/task/task.entity'
import User from '../models/user/user.entity'

const defaultOptions: ConnectionOptions = {
  ...(ormConfig as ConnectionOptions),
  entities: [List, Task, User],
  // overwrite this so we dont try to read ts files
  migrations: [],
}

export default function initConnection(options: Partial<ConnectionOptions> = {}): Promise<Connection> {
  return createConnection({
    ...defaultOptions,
    ...options,
  } as ConnectionOptions)
}
