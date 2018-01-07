import Command from '@cli-engine/command'
import colors from '@heroku-cli/color'
import cli from 'cli-ux'
import * as path from 'path'
import * as readPkgUp from 'read-pkg-up'

const { version } = readPkgUp.sync({ cwd: __dirname }).pkg

const idColors: { [k: string]: any } = {
  prepare: colors.green,
  setup: colors.greenBright,
  test: colors.yellowBright,
}

function colorize(id: string): string {
  return (idColors[id] || colors.red)(id)
}

export default abstract class UtilCommand extends Command {
  pkg: readPkgUp.Package
  root: string
  version = version

  async init(opts: any) {
    await super.init(opts)
    await this.validate()
    cli.log(
      `@cli-engine/util: ${colorize(this.ctor.id)} ${this.pkg.name}:${this.pkg.version} node:${
        process.versions.node
      } util:${version}`,
    )
  }

  protected async validate() {
    const pkg = await readPkgUp()
    if (!pkg) throw new Error('no package.json found. is this run from a plugin?')
    this.pkg = pkg.pkg
    this.root = path.dirname(pkg.path)
    // if (!this.pkg['cli-engine'] || !this.pkg['cli-engine'].type) {
    //   throw new Error('package.json has no entry for [cli-engine].type. If this is a CLI plugin, specify the type as "plugin". If this is a cli-engine CLI, specify "cli".')
    // }
  }
}
export { flags } from '@cli-engine/command'
