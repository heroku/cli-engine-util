import * as path from 'path'

import Prepare from './prepare'

jest.mock('../fs')
jest.mock('../util')

const fs = require('../fs')
const util = require('../util')

test('ok', async () => {
  fs.exists.mockImplementation((f: any) => Promise.resolve(f === './lib'))
  fs.readJSON.mockImplementation(
    (f: any) =>
      f === 'tsconfig.json' &&
      Promise.resolve({
        compilerOptions: {
          outDir: './lib',
        },
      }),
  )
  await Prepare.mock()
  expect(fs.del).toBeCalledWith('lib')
  expect(util.spawn).toBeCalledWith('tsc')
  expect(fs.del).toBeCalledWith([`lib${path.sep}**${path.sep}*.test.+(d.ts|js)`, `lib${path.sep}**${path.sep}__test__`])
})
