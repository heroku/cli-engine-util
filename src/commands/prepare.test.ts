import * as path from 'path'

import Prepare from './prepare'

const fixtures = path.join(__dirname, '../../test/fixtures')

const cwd = process.cwd()
beforeEach(() => {
  process.chdir(path.join(fixtures, 'lint'))
})
afterEach(() => {
  process.chdir(cwd)
})

jest.setTimeout(30000)

test('runs prepare', async () => {
  await Prepare.mock()
})
