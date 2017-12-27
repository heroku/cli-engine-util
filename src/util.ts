import { SpawnOptions } from 'child_process'
import cli from 'cli-ux'

export function spawn(command: string, args: string[] = [], opts: SpawnOptions = {}) {
  const spawn = require('cross-spawn')
  return new Promise((resolve, reject) => {
    cli.log(`$ ${[command, ...args].join(' ')}`)
    spawn(command, args, { stdio: 'inherit', ...opts })
      .on('close', (c: SpawnOptions) => {
        if (c !== 0) reject(`Exited with code ${c}`)
        resolve()
      })
      .on('error', reject)
  })
}
