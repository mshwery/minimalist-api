import { merge } from 'lodash'
import { GraphQLDate, GraphQLDateTime } from 'graphql-iso-date'
import { resolvers as authResolvers } from './auth'
import { resolvers as listResolvers } from './list'
import { resolvers as taskResolvers } from './task'
import { resolvers as userResolvers } from './user'

const scalarResolvers = {
  // Custom ISO 8601 date (no time) resolver
  Date: GraphQLDate,
  // Custom ISO 8601 UTC datetime
  DateTime: GraphQLDateTime
}

export default merge(scalarResolvers, authResolvers, listResolvers, taskResolvers, userResolvers)
