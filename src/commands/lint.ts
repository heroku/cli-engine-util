import cli from 'cli-ux'

import Command, { flags } from '../command'
import Lint from '../lint'
import { spawn } from '../util'

export default class LintCommand extends Command {
  static flags: flags.Input = {
    fix: flags.boolean(),
  }
  static aliases = ['precommit', 'posttest']

  async run() {
    const tasks = Lint(this.flags)
    cli.log(`@cli-engine/util: linting with ${tasks.map(t => t.split(' ')[0]).join(', ')}...`)
    await spawn('concurrently', ['-p', 'command', '-s', 'all', ...tasks])
  }
}
