import cli from 'cli-ux'

import Command, { flags } from '../command'
import * as Lint from '../lint'

export default class LintCommand extends Command {
  static flags: flags.Input = {
    fix: flags.boolean(),
  }
  static aliases = ['precommit']

  async run() {
    const linters = Lint.active()
    cli.action.start(`@cli-engine/util: linting with ${linters.join(', ')}`)
    const jobs = linters.map(l => Lint.lint[l](this.flags))
    const results = await Promise.all(jobs)
    cli.action.stop()
    for (let r of results) {
      if (r.error) throw r.error
      if (r.stderr) cli.warn(r.stderr, { context: r.cmd })
      if (r.stdout) cli.log(`$ ${r.cmd}\n${r.stdout}`)
    }
  }
}
