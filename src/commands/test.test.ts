import * as path from 'path'

import Test from './test'

const cliStatus = path.join(__dirname, '../../plugins/heroku-cli-status')

const cwd = process.cwd()
beforeEach(() => {
  process.chdir(cliStatus)
})
afterEach(() => {
  process.chdir(cwd)
})

jest.setTimeout(30000)

test('runs test', async () => {
  process.chdir(cliStatus)
  await Test.mock()
})
