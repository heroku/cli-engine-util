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
  const { stderr } = await Test.mock()
  expect(stderr).toContain('@cli-engine/util: linting with yarn, tsc, tslint, prettier... done\n')
})

test('runs test when no jest', async () => {
  process.chdir(path.join(fixtures, 'lint'))
  const { stderr } = await Test.mock()
  expect(stderr).toContain('jest is not in package.json devDependencies')
})
