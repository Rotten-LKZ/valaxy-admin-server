import dbo from '../db/conn'
import express from 'express'
import result from '../utils/result'

const router = express.Router()

router.get('/', async (req, res) => {
  let resp: any
  try {
    resp = await dbo.getDb().collection('articles').find({}).toArray()
    result.succ({ data: resp.map((cur: any) => ({ title: cur.title, filename: cur.filename, content: cur.content })) }, res)
  } catch (e) {
    console.error(e)
    result.badRequest(res)
  }
})

router.post('/', async (req, res) => {
  const { title, filename, content } = req.body
  if (title && filename && content) {
    let resp: any
    try {
      resp = await dbo.getDb().collection('articles').insertOne({ title, filename, content })
      result.succ({ status: resp.acknowledged }, res)
    } catch (e) {
      console.error(e)
      result.badRequest(res)
    }
  } else {
    result.badRequest(res)
  }
})

export default router
