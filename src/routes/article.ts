import dbo from '../db/conn'
import express from 'express'
import result from '../utils/result'
import controller from '../controller'

const router = express.Router()

router.get('/', async (req, res) => {
  let resp: any
  try {
    resp = await dbo.getDb().collection('articles').find({}).toArray()
    result.succ({ status: true, articles: resp.map((cur: any) => ({ title: cur.title, filename: cur.filename, content: cur.content })) }, res)
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
      controller.updateArticle(filename, content)
    } catch (e) {
      console.error(e)
      result.badRequest(res)
    }
  } else {
    result.badRequest(res)
  }
})

router.delete('/', async (req, res) => {
  const { filename } = req.body
  if (filename) {
    let resp: any
    try {
      resp = await dbo.getDb().collection('articles').deleteOne({ filename })
      result.succ({ status: resp.acknowledged }, res)
      controller.removeArticle(filename)
    } catch (e) {
      console.error(e)
      result.badRequest(res)
    }
  } else {
    result.badRequest(res)
  }
})

router.put('/', async (req, res) => {
  const { filename, title, content } = req.body
  if (filename && title && content) {
    let resp: any
    try {
      resp = await dbo.getDb().collection('articles').updateOne({ filename }, { $set: { title, content } })
      result.succ({ status: resp.acknowledged }, res)
      controller.updateArticle(filename, content)
    } catch (e) {
      console.error(e)
      result.badRequest(res)
    }
  } else {
    result.badRequest(res)
  }
})

export default router
