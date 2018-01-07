import cli from 'cli-ux'
import * as execa from 'execa'
import * as fs from 'fs-extra'
import * as path from 'path'

export function spawn(command: string, args: string[] = [], opts: execa.Options = {}) {
  return execa(command, args, {
    localDir: path.join('node_modules', '.bin'),
    stdio: cli.config.mock ? [] : 'inherit',
    ...opts,
  })
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
