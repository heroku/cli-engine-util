import cli from 'cli-ux'

import Command, { flags } from '../command'
import * as Lint from '../lint'
import { hasJest, spawn } from '../util'

export default class Test extends Command {
  static variableArgs = true
  static flags: flags.Input = {
    fix: flags.boolean({ char: 'f' }),
  }

  async run() {
    const linters = Lint.active()
    const lint = linters.map(l => Lint.lint[l](this.flags))
    const tasks: Promise<any>[] = lint.slice(0)

    if (hasJest(this.pkg)) {
      cli.log(`$ jest ${this.argv.join(' ')}`)
      tasks.push(spawn('jest', this.argv))
    } else cli.warn('jest is not in package.json devDependencies')

    await Promise.all(tasks)

    cli.action.start(`@cli-engine/util: linting with ${linters.join(', ')}`)
    let lintResult = await Promise.all(lint)
    cli.action.stop()

    for (let r of lintResult) {
      if (r.error) throw r.error
      if (r.stderr) cli.warn(r.stderr, { context: r.cmd })
      if (r.stdout) cli.log(`$ ${r.cmd}\n${r.stdout}`)
    }
  }
}
