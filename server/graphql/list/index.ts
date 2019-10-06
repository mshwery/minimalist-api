import fs from 'fs'
import path from 'path'
import Query from './Query'
import Mutation from './Mutation'
import List from './List'

export const typeDef = fs.readFileSync(path.join(__dirname, './list.graphql'), 'utf8')

export const resolvers = {
  Query,
  Mutation,
  List
}
