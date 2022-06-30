import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

function updateArticle(filename: string, content: string) {
  const runDir = path.resolve('template/pages/posts')
  fs.writeFile(path.resolve(runDir, filename), content, (err) => {
    if (err) {
      console.error(err)
      return
    } else {
      execSync('git add .', { cwd: runDir })
      execSync(`git commit -m "chore: update ${filename}"`, { cwd: runDir })
      execSync(`git push`, { cwd: runDir })
    }
  })
}

function removeArticle(filename: string) {
  const runDir = path.resolve('template/pages/posts')
  fs.rm(path.resolve(runDir, filename), (err) => {
    if (err) {
      console.error(err)
      return
    } else {
      execSync('git add .', { cwd: runDir })
      execSync(`git commit -m "chore: remove ${filename}"`, { cwd: runDir })
      execSync(`git push`, { cwd: runDir })
    }
  })
}

export default { updateArticle, removeArticle }
