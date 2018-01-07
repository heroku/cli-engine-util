import cli from 'cli-ux'
import * as Del from 'del'
import * as fs from 'fs-extra'
import * as path from 'path'

import Command from '../command'
import { spawn } from '../util'

interface TSConfig {
  compilerOptions: {
    outDir?: string
  }
}

async function del(p: string | string[]) {
  cli.log(`$ del ${p}`)
  await Del(p)
}

export default class Prepare extends Command {
  async run() {
    const tsconfig: TSConfig = await fs.readJSON('tsconfig.json')
    const outDir = tsconfig.compilerOptions.outDir
    if (!outDir) throw new Error('outDir not defined in tsconfig.json')
    await del(path.join(outDir))
    cli.log(`$ tsc`)
    await spawn('tsc')
    await del([path.join(outDir, '**', '*.test.+(d.ts|js)'), path.join(outDir, '**', '__test__')])
  }
}
