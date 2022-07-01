import path from 'path'
import multer from 'multer'
import dbo from '../db/conn'
import express from 'express'
import result from '../utils/result'
import { rename } from 'fs/promises'
import { existsSync, mkdirSync } from 'fs'

// 需要斜杠
const router = express.Router()
const upload = multer({ dest: 'upload/' })

interface File {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  size: number
  destination: string
  filename: string
  path: string
}

router.post('/', upload.array('pictures'), async (req, res) => {
  if (req.files) {
    try {
      let urls: string[] = []
      // @ts-ignore
      const pics: File[] = req.files
      const now = new Date()
      const relativePath = `${now.getFullYear().toString()}/${addZero(now.getMonth() + 1)}/${addZero(now.getDate())}`
      const savePath = path.resolve('upload', relativePath)
      mkdirsSync(savePath)
      for (const picture of pics) {
        await rename(path.resolve(picture.path), path.resolve(savePath, picture.originalname))
        dbo.getDb().collection('images').insertOne({ filename: picture.originalname, path: `${relativePath}/${picture.originalname}` })
        urls.push(`${process.env.BASE_URL}${relativePath}/${picture.originalname}`)
      }
      result.succ({ status: true, urls }, res)
    } catch (e) {
      console.error(e)
      result.badRequest(res)
    }
  } else {
    result.badRequest(res)
  }
})

function addZero(num: number): string {
  return num < 10 ? `0${num}` : num.toString()
}

function mkdirsSync(dirname: string) {
  if (!existsSync(dirname)) {
    mkdirsSync(path.dirname(dirname))
    mkdirSync(dirname)
  }
}

export default router
