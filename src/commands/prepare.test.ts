import * as execa from 'execa'
import * as path from 'path'

import Prepare from './prepare'

const cliStatus = path.join(__dirname, '../../plugins/heroku-cli-status')

const cwd = process.cwd()
beforeEach(() => {
  process.chdir(cliStatus)
})
afterEach(() => {
  process.chdir(cwd)
})

jest.setTimeout(30000)

test('runs prepare', async () => {
  process.chdir(cliStatus)
  await execa('yarn')
  await Prepare.mock()
})
