import fs from 'fs'
import path from 'path'
import Query from './Query'

export const typeDef = fs.readFileSync(path.join(__dirname, './user.graphql'), 'utf8')

export const resolvers = {
  Query,
}
