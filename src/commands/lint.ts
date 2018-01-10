import Command, { flags } from '../command'
import Lint from '../lint'
import { concurrently } from '../util'

export default class LintCommand extends Command {
  static flags: flags.Input = {
    fix: flags.boolean(),
  }
  static aliases = ['precommit', 'posttest']

  async run() {
    const tasks = Lint(this.flags)
    await concurrently(tasks)
  }
}
