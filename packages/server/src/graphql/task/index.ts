import fs from 'fs'
import path from 'path'
import Query from './Query'
import Mutation from './Mutation'

export const typeDef = fs.readFileSync(path.join(__dirname, './task.graphql'), 'utf8')

export const resolvers = {
  Query,
  Mutation,
}
