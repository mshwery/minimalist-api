import { merge } from 'lodash'
import { resolvers as authResolvers } from './auth'
import { resolvers as listResolvers } from './list'
import { resolvers as taskResolvers } from './task'
import { resolvers as userResolvers } from './user'

const rootResolvers = {}

export default merge(rootResolvers, authResolvers, listResolvers, taskResolvers, userResolvers)
