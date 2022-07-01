import path from 'path'
import multer from 'multer'
import dbo from '../db/conn'
import express from 'express'
import file from '../utils/file'
import number from '../utils/number'
import result from '../utils/result'
import { rename, rm } from 'fs/promises'
import { ObjectId } from 'mongodb'

// 需要斜杠
const router = express.Router()
const upload = multer({ dest: 'upload/' })
const { addZero } = number
const { extensionToLowerCase, mkdirsSync } = file

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
        const filename = extensionToLowerCase(picture.originalname)
        await rename(path.resolve(picture.path), path.resolve(savePath, filename))
        updateFile(filename, `${relativePath}/${filename}`, now.getTime())
        urls.push(`${process.env.BASE_URL}${relativePath}/${filename}`)
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

router.get('/', async (_req, res) => {
  try {
    const resp = await dbo.getDb().collection('images').find({}).toArray()
    result.succ({ status: true, images: resp.map((cur) => ({ id: cur._id.toHexString(), filename: cur.filename, url: `${process.env.BASE_URL}${cur.path}` })) }, res)
  } catch (e) {
    console.error(e)
    result.badRequest(res)
  }
})

router.delete('/', async (req, res) => {
  const { id } = req.body
  if (id) {
    try {
      const resp = await dbo.getDb().collection('images').findOne({ _id: ObjectId.createFromHexString(id) })
      if (resp) {
        await rm(path.resolve('upload', resp.path))
        await dbo.getDb().collection('images').deleteOne({ _id: ObjectId.createFromHexString(id) })
        result.succ({ status: true }, res)
      } else {
        result.badRequest(res)
      }
    } catch (e) {
      console.error(e)
      result.badRequest(res)
    }
  } else {
    result.badRequest(res)
  }
})

async function updateFile(filename: string, path: string, updatedAt: number) {
  const resp = await dbo.getDb().collection('images').findOne({ path })
  if (resp)
    dbo.getDb().collection('images').updateOne({ path, updatedAt }, { $set: { filename } })
  else
    dbo.getDb().collection('images').insertOne({ filename, path, updatedAt })
}

export default router
