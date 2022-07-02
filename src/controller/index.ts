import { execSync } from 'child_process'
import { rm, writeFile } from 'fs'
import path from 'path'
import dbo from '../db/conn'

const basePath = path.resolve('template/pages/posts')

async function push() {
  try {
    const resp = await dbo.getDb().collection('operations').find({}).toArray()
    for (const operation of resp) {
      if (operation.type === 'update') await update(operation.filename, operation.content)
      else if (operation.type === 'delete') await del(operation.filename)
    }
    await dbo.getDb().collection('operations').deleteMany({})
    if (process.env.COMMAND) {
      execSync(process.env.COMMAND, { cwd: basePath })
    } else {
      execSync('git add .', { cwd: basePath })
      execSync('git commit -m "chore: update"', { cwd: basePath })
      execSync('git push -f', { cwd: basePath })
    }
  } catch (e) {
    console.error(e)
  }
}

function update(filename: string, content: string) {
  return new Promise((resolve, reject) => {
    writeFile(path.resolve(basePath, filename), content, (err) => {
      if (err) reject(err)
      else resolve(true)
    })
  })
}

function del(filename: string) {
  return new Promise((resolve, reject) => {
    rm(path.resolve(basePath, filename), (err) => {
      if (err) reject(err)
      else resolve(true)
    })
  })
}

export default { push }
