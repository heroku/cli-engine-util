import cli from 'cli-ux'

import Command, { flags } from '../command'
import Lint from '../lint'
import { hasJest, spawn } from '../util'

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

    cli.log(`@cli-engine/util: testing with ${tasks.map(t => t.split(' ')[0]).join(', ')}...`)

    await spawn('concurrently', ['-p', 'command', '-s', 'all', ...tasks])
  }
}
