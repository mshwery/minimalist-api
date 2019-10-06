import { GraphQLClient } from 'graphql-request'

// Shim to get support for syntax highlighting without requiring grapqhl-tag
// (graphql-request doesn't seem to support it OOTB)
export const gql = (tag: TemplateStringsArray) => tag

export default new GraphQLClient('/graphql')
