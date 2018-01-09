import * as execa from 'execa'
import * as path from 'path'

import { testSkipIfWindows } from '../test/init'

import Lint from './lint'

const fixtures = path.join(__dirname, '../../test/fixtures')

const { npm_lifecycle_event } = process.env
const cwd = process.cwd()
beforeEach(() => {
  process.env.npm_lifecycle_event = 'test'
})
afterEach(() => {
  process.env.npm_lifecycle_event = npm_lifecycle_event
  process.chdir(cwd)
})

jest.setTimeout(30000)

test('runs test', async () => {
  process.chdir(path.join(fixtures, 'lint'))
  const { stdout } = await Lint.mock()
  expect(stdout).toContain('@cli-engine/util: linting with tsc, tslint, prettier, commitlint...\n')
})

test('tsc works', async () => {
  process.chdir(path.join(fixtures, 'tsc'))
  await expect(Lint.mock()).rejects.toThrowError(
    `invalid.ts(1,22): error TS6133: 'a' is declared but its value is never read.`,
  )
})

test('tslint works', async () => {
  process.chdir(path.join(fixtures, 'tslint'))
  await expect(Lint.mock()).rejects.toThrowError(
    `/tslint/src/invalid.ts[2, 3]: Calls to 'console.log' are not allowed.`,
  )
})

testSkipIfWindows('prettier works', async () => {
  process.chdir(path.join(fixtures, 'prettier'))
  execa.sync('yarn')
  await expect(Lint.mock()).rejects.toThrowError('src/invalid.js')
})
