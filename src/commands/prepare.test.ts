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
          lib: './lib',
        },
      }),
  )
  await Prepare.mock()
  expect(fs.remove).toBeCalledWith('./lib')
  expect(util.sh).toBeCalledWith('tsc')
  expect(fs.remove).toBeCalledWith('tsc')
})
