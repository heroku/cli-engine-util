import { Command, flags } from '@cli-engine/command'
import cli from 'cli-ux'

import { hasPrettier, hasTSLint, spawn } from '../util'

export default class Lint extends Command {
  static flags: flags.Input = {
    fix: flags.boolean({ char: 'f' }),
  }
  static aliases = ['precommit', 'posttest']

  async run() {
    await spawn('node', ['--version'])
    if (hasTSLint()) {
      await this.tslint()
    }
    if (hasPrettier()) {
      await this.prettier()
    }
  }

  private async tslint() {
    try {
      const args = ['--project', '.']
      if (this.flags.fix) args.push('--fix')
      await spawn('tslint', args)
    } catch (err) {
      if (err.code === 'ENOENT') cli.warn('tslint is not installed')
      else {
        cli.log(`Error in tslint. Run \`${this.cmd} --fix\` to try to fix issues automatically.`)
        throw err
      }
    }
  }

  private async prettier() {
    try {
      const args = ['--list-different', 'src/**/*.ts', 'src/**/*.js']
      if (this.flags.fix) args[0] = '--write'
      await spawn('prettier', args)
    } catch (err) {
      if (err.code === 'ENOENT') cli.warn('prettier is not installed')
      else {
        cli.log(
          `Prettier would generate these files differently. Run \`${
            this.cmd
          } --fix\` to try to fix issues automatically.`,
        )
        throw err
      }
    }
  }

  private get cmd(): string {
    const script = process.env.npm_lifecycle_event
    if (script && this.ctor.aliases.includes(script)) {
      return `yarn run ${script}`
    }
    return 'cli-engine-util lint'
  }
}
