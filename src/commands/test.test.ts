import * as path from 'path'

import { testSkipIfWindows } from '../test/init'

import Test from './test'

const fixtures = path.join(__dirname, '../../test/fixtures')

const cwd = process.cwd()
afterEach(() => {
  process.chdir(cwd)
})

jest.setTimeout(30000)

testSkipIfWindows('runs test', async () => {
  process.chdir(path.join(fixtures, 'jest'))
  const { stdout } = await Test.mock()
  expect(stdout).toContain('@cli-engine/util: testing with jest, tsc, tslint, prettier...\n')
})

test('runs test when no jest', async () => {
  process.chdir(path.join(fixtures, 'lint'))
  const { stderr } = await Test.mock()
  expect(stderr).toContain('jest is not in package.json devDependencies')
})
