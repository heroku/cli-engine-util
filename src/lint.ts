import color from '@heroku-cli/color'
import * as execa from 'execa'
import _ from 'ts-lodash'

import { hasPrettier, hasTSLint, hasTypescript, spawn } from './util'

export type Linter = 'yarn' | 'tsc' | 'tslint' | 'prettier'

export interface Options {
  fix?: boolean
}

export type Result = execa.ExecaReturns & { error?: Error }

export function active(): Linter[] {
  return _.compact([
    'yarn',
    hasTypescript() && 'tsc',
    hasTSLint() && 'tslint',
    hasPrettier() && 'prettier',
  ])
}

export const lint: { [k: string]: (opts: Options) => Promise<Result> } = {
  async yarn() {
    const result = await spawn('yarn', ['check'], { reject: false, stdio: [] })
    if (isExecaError(result)) return { ...result, error: result }
    return result
  },
  async tsc() {
    const result = await spawn('tsc', [], { reject: false, stdio: [] })
    if (isExecaError(result)) return { ...result, error: result }
    return result
  },
  async tslint({ fix }) {
    const args = ['--project', '.']
    if (fix) args.push('--fix')
    const result = await spawn('tslint', args, { reject: false, stdio: [] })
    if (isExecaError(result)) return { ...result, error: new TSLintError(result) }
    return result
  },
  async prettier({ fix }) {
    const args = ['--list-different', 'src/**/*.ts', 'src/**/*.js']
    if (fix) args[0] = '--write'
    const result: Result = await spawn('prettier', args, { reject: false, stdio: [] })
    if (isExecaError(result)) return { ...result, error: new PrettierError(result) }
    return result
  },
}

export function cmd(): string {
  const script = process.env.npm_lifecycle_event
  if (script && ['precommit', 'test'].includes(script)) {
    return script === 'test' ? 'yarn test' : `yarn run ${script}`
  }
  return 'cli-engine-util lint'
}

function combinedOutput(err: execa.ExecaError) {
  return _.compact([err.stdout, err.stderr]).join('\n')
}

export class TSLintError extends Error {
  constructor(err: execa.ExecaError) {
    if (err.code !== 2) return err
    else {
      const command = color.cmd(`${cmd()} --fix`)
      super(`Error in tslint:
${combinedOutput(err)}Run ${command} to try to fix issues automatically.`)
    }
  }
}

export class PrettierError extends Error {
  constructor(err: execa.ExecaError) {
    if (err.code !== 1) return err
    else {
      const command = color.cmd(`${cmd()} --fix`)
      super(`Prettier would generate these files differently:

${combinedOutput(err)}
Run ${command} to try to fix issues automatically.`)
    }
  }
}

function isExecaError(r: execa.ExecaReturns): r is execa.ExecaError {
  return r.code !== 0
}
