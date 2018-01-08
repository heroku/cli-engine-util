import cli from 'cli-ux'

export const testSkipIfWindows = process.platform === 'win32' ? test.skip : test

beforeEach(() => {
  cli.config.mock = true
})
