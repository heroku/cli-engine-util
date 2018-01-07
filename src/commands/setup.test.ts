import * as fs from 'fs-extra'
import * as path from 'path'

import Setup from './setup'

const cliStatus = path.join(__dirname, '../../plugins/heroku-cli-status')
const readFile = (file: string) => fs.readFileSync(file, 'utf8')

const cwd = process.cwd()
beforeEach(() => {
  process.chdir(cliStatus)
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
