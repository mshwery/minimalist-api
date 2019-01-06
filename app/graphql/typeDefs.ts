import { typeDef as RootSchema } from './root'
import { typeDef as Auth } from './auth'
import { typeDef as List } from './list'
import { typeDef as Task } from './task'
import { typeDef as User } from './user'

export default [RootSchema, Auth, List, Task, User]
