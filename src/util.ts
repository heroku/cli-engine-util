import { spawn } from 'child_process'
import cli from 'cli-ux'

export function sh(command: string, args: string[] = []) {
  return new Promise((resolve, reject) => {
    cli.log(`$ ${[command, ...args].join(' ')}`)
    spawn(command, args, {
      stdio: 'inherit',
    })
      .on('close', c => {
        if (c !== 0) reject(`Exited with code ${c}`)
        resolve()
      })
      .on('error', reject)
  })
}
