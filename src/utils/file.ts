
import path from 'path'
import { existsSync, mkdirSync } from 'fs'

function extensionToLowerCase(filename: string) {
  const s = filename.split('.')
  s[s.length - 1] = s[s.length - 1].toLowerCase()
  return s.join('.')
}

function mkdirsSync(dirname: string) {
  if (!existsSync(dirname)) {
    mkdirsSync(path.dirname(dirname))
    mkdirSync(dirname)
  }
}

export default { extensionToLowerCase, mkdirsSync }
