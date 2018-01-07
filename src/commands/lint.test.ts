import * as execa from 'execa'
import * as path from 'path'

import { cmd } from '../lint'

import Lint from './lint'

const fixtures = path.join(__dirname, '../../test/fixtures')

const win = process.platform === 'win32'
const skipOnWindows = win ? test.skip : test

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
  const { stderr } = await Lint.mock()
  expect(stderr).toEqual('@cli-engine/util: linting with tsc, tslint, prettier... done\n')
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

skipOnWindows('prettier works', async () => {
  process.chdir(path.join(fixtures, 'prettier'))
  execa.sync('yarn')
  await expect(Lint.mock()).rejects.toThrowError(`Prettier would generate these files differently:

src/invalid.js

Run yarn test --fix to try to fix issues automatically.`)
})

test('cmd', () => {
  expect(cmd()).toEqual('yarn test')
  process.env.npm_lifecycle_event = 'precommit'
  expect(cmd()).toEqual('yarn run precommit')
  delete process.env.npm_lifecycle_event
  expect(cmd()).toEqual('cli-engine-util lint')
})
