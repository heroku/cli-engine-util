import * as fs from 'fs-extra'
import * as path from 'path'

import Setup from './setup'

const fixtures = path.join(__dirname, '../../test/fixtures')
const readFile = (file: string) => fs.readFileSync(file, 'utf8')

const cwd = process.cwd()
beforeEach(() => {
  process.chdir(path.join(fixtures, 'lint'))
})
afterEach(() => {
  process.chdir(cwd)
})

test('adds ci_run script', async () => {
  fs.removeSync(path.join('scripts'))
  await Setup.mock()
  expect(readFile(path.join('scripts/ci_run'))).toContain('# version: 1')
})

test('does not modify existing ci_run script', async () => {
  fs.outputFileSync(path.join('scripts/ci_run'), 'foobarbaz')
  await Setup.mock()
  expect(readFile(path.join('scripts/ci_run'))).toEqual('foobarbaz')
})
