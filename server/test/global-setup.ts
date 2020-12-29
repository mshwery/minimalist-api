import 'reflect-metadata'
import { resetDb } from './test-db'

export default async function (): Promise<void> {
  await resetDb()
}
