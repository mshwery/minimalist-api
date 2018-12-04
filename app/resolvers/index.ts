import { pickBy, negate, isUndefined, merge } from 'lodash'
import listResolvers from './lists'
import taskResolvers from './tasks'

const rootResolvers = {
  Query: {},
  Mutation: {}
}

const resolvers = merge(rootResolvers, listResolvers, taskResolvers)

// omit any empty objects (they'll throw errors anyway)
export default pickBy(resolvers, negate(isUndefined))
