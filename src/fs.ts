import cli from 'cli-ux'
import * as Del from 'del'
import * as fs from 'fs-extra'

export function exists(f: string) {
  // @ts-ignore
  return fs.exists(f)
}

export async function remove(f: string) {
  if (!await exists(f)) return
  cli.log(`$ rm -rf ${f}`)
  await fs.remove(f)
}

export async function del(p: string) {
  cli.log(`$ del ${p}`)
  await Del(p)
}

export function readJSON(f: string) {
  return fs.readJSON(f)
}
