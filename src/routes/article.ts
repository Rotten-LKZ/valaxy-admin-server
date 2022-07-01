import dbo from '../db/conn'
import express from 'express'
import result from '../utils/result'
import controller from '../controller'

const router = express.Router()

router.get('/', async (_req, res) => {
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
      updateOne(filename, content)
      result.succ({ status: resp.acknowledged }, res)
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
      deleteOne(filename)
      result.succ({ status: resp.acknowledged }, res)
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
      updateOne(filename, content)
      result.succ({ status: resp.acknowledged }, res)
    } catch (e) {
      console.error(e)
      result.badRequest(res)
    }
  } else {
    result.badRequest(res)
  }
})

router.post('/push', (_req, res) => {
  controller.push()
  result.succ({ status: true }, res)
})

async function updateOne(filename: string, content: string) {
  const resp = await dbo.getDb().collection('operations').findOne({ filename })
  if (resp)
    await dbo.getDb().collection('operations').updateOne({ filename }, { $set: { type: 'update', content } })
  else
    await dbo.getDb().collection('operations').insertOne({ type: 'update', filename, content })
}

async function deleteOne(filename: string) {
  const resp = await dbo.getDb().collection('operations').findOne({ filename })
  if (resp)
    await dbo.getDb().collection('operations').updateOne({ filename }, { $set: { type: 'delete' } })
  else
    await dbo.getDb().collection('operations').insertOne({ type: 'delete', filename, content: '' })
}

export default router
