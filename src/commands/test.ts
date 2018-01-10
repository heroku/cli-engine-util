import cli from 'cli-ux'

import Command, { flags } from '../command'
import Lint from '../lint'
import { concurrently, hasJest } from '../util'

export default class Test extends Command {
  static variableArgs = true
  static flags: flags.Input = {
    fix: flags.boolean({ char: 'f' }),
  }

  async run() {
    let tasks = Lint(this.flags)

    if (hasJest(this.pkg)) {
      tasks = [['jest', ...this.argv].join(' '), ...tasks]
    } else cli.warn('jest is not in package.json devDependencies')

    await concurrently(tasks)
  }
}
