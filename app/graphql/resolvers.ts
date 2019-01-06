import { merge } from 'lodash'
import { resolvers as rootResolvers } from './root'
import { resolvers as authResolvers } from './auth'
import { resolvers as listResolvers } from './list'
import { resolvers as taskResolvers } from './task'
import { resolvers as userResolvers } from './user'

export default merge(rootResolvers, authResolvers, listResolvers, taskResolvers, userResolvers)
