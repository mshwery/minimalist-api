import fs from 'fs'
import path from 'path'
import Mutation from './Mutation'

export const typeDef = fs.readFileSync(path.join(__dirname, './auth.graphql'), 'utf8')

export const resolvers = {
  Mutation
}
