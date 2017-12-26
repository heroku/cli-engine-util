import { Command, flags } from 'cli-engine-command'
import cli from 'cli-ux'

import { sh } from '../util'

export default class Lint extends Command {
  static flags: flags.Input = {
    fix: flags.boolean({ char: 'f' }),
  }

  async run() {
    await this.tslint()
    await this.prettier()
  }

  private async tslint() {
    try {
      const args = ['--project', '.']
      if (this.flags.fix) args.push('--fix')
      await sh('tslint', args)
    } catch (err) {
      if (err.code === 'ENOENT') cli.warn('tslint is not installed')
      else {
        cli.log('Error in tslint. Run `yarn run lint --fix` to try to fix issues automatically.')
        throw err
      }
    }
  }

  private async prettier() {
    try {
      const args = ['--list-different', 'src/**/*.ts', 'src/**/*.js']
      if (this.flags.fix) args[0] = '--write'
      await sh('prettier', args)
    } catch (err) {
      if (err.code === 'ENOENT') cli.warn('prettier is not installed')
      else {
        cli.log(
          'Prettier would generate these files differently. Run `yarn run lint --fix` to try to fix issues automatically.',
        )
        throw err
      }
    }
  }
}
