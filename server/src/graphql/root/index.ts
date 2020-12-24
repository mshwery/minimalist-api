import fs from 'fs'
import path from 'path'
import { GraphQLDate, GraphQLDateTime } from 'graphql-iso-date'

export const typeDef = fs.readFileSync(path.join(__dirname, './schema.graphql'), 'utf8')

export const resolvers = {
  // Custom ISO 8601 date (no time) resolver
  Date: GraphQLDate,

  // Custom ISO 8601 UTC datetime
  DateTime: GraphQLDateTime,

  // Apollo Server 2 aims to make the defaults follow best practices, such as defining type resolution for unions/interfaces
  // @see {@link https://github.com/apollographql/apollo-server/issues/1075}
  Node: {
    __resolveType(): null {
      return null
    },
  },
}
