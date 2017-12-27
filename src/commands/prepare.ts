import { Command } from '@cli-engine/command'
import * as path from 'path'

import * as fs from '../fs'
import { sh } from '../util'

interface TSConfig {
  compilerOptions: {
    outDir?: string
  }
}

export default class Prepare extends Command {
  async run() {
    const tsconfig: TSConfig = await fs.readJSON('tsconfig.json')
    const outDir = tsconfig.compilerOptions.outDir
    if (!outDir) throw new Error('outDir not defined in tsconfig.json')
    await fs.del(path.join(outDir))
    await sh('tsc')
    await fs.del([path.join(outDir, '**', '*.test.+(d.ts|js)'), path.join(outDir, '**', '__test__')])
  }
}
