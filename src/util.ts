import cli from 'cli-ux'
import * as execa from 'execa'
import * as fs from 'fs-extra'

export function spawn(command: string, args: string[] = [], opts: execa.Options = {}) {
  cli.log(`$ ${[command, ...args].join(' ')}`)
  return execa(command, args, { stdio: cli.config.mock ? [] : 'inherit', ...opts })
}

export function hasTSLint(): boolean {
  return fs.existsSync('tslint.json')
}

export function hasPrettier(): boolean {
  return fs.existsSync('.prettierrc')
}

export function hasTypescript(): boolean {
  return fs.existsSync('tsconfig.json')
}

export function hasJest(pkg: any): boolean {
  return pkg.devDependencies && pkg.devDependencies.jest
}
