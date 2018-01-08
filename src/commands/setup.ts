import color from '@heroku-cli/color'
import cli from 'cli-ux'
import * as fs from 'fs-extra'
import * as handlebars from 'handlebars'
import * as diff from 'jest-diff'
import * as path from 'path'

import Command, { flags } from '../command'

export default class Setup extends Command {
  static aliases = ['install']
  static description = 'setup a plugin'
  static flags: flags.Input = {
    overwrite: flags.boolean(),
  }
  static help = `
This runs automatically when the plugin is installed so there is no need to run it directly.

It creates a file './scripts/ci_run' that is intented to be used by circle ci runs.
`

  async run() {
    await this.outputTemplate(path.join('scripts', 'ci_run'))
    await fs.chmod(path.join('scripts', 'ci_run'), '755')
    // await this.outputTemplate(path.join('scripts', 'shellcheck'))
    // await fs.chmod(path.join('scripts', 'shellcheck'), '755')
    await this.validateGitignore()
  }

  private get templateRoot(): string {
    return path.join(__dirname, '../../templates')
  }

  private async outputTemplate(file: string, opts: object = {}) {
    this.debug(`output to ${file} opts: %o`, opts)
    const template = handlebars.compile(await fs.readFile(path.join(this.templateRoot, `${file}.hbs`), 'utf8'))
    const output = template(opts)
    if (!this.flags.overwrite && (await fs.pathExists(file))) {
      let existing = await fs.readFile(file, 'utf8')
      if (existing === output) return
      const cmd = color.cmd('cli-engine-util setup --overwrite')
      cli.warn(`Expected ${file} to have different content:\n\n${diff(output, existing)}\nRun ${cmd} to replace it.`)
      return
    }
    cli.log(`write ${file}`)
    await fs.outputFile(path.join(this.root, file), output)
  }

  private async validateGitignore() {
    const expected = ['/coverage', '/lib', '/node_modules', '/yarn-error.log']
    const p = path.join(this.root, '.gitignore')
    try {
      const gi = await fs.readFile(p, 'utf8')
      for (let e of expected) {
        if (!gi.includes(e)) cli.warn(`Expected .gitignore to have "${e}"`)
      }
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
      cli.log(`write ${p}`)
      await fs.writeFile(p, expected.join('\n') + '\n')
    }
  }
}
