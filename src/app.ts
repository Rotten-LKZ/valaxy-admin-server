import 'dotenv/config'
import cors from 'cors'
import path from 'path'
import dbo from './db/conn'
import router from './routes'
import express from 'express'
import jwt from './utils/jwt'
import urlencode from 'urlencode'
import result from './utils/result'
import { createReadStream } from 'fs'
import { createProxyMiddleware } from 'http-proxy-middleware'


;(async () => {
  const dbConn = await dbo.connectToServer()
  if (dbConn === false) {
    console.error('Failed to connect to MongoDB')
    return
  }

  const app = express()
  app.use(cors({
    origin: (origin, cb) => {
      const whitelist = ['http://127.0.0.1:3000', 'abracadabra']
      const allowed = whitelist.indexOf(origin || 'abracadabra') !== -1
      if (allowed)
        cb(null, true)
      else
        cb(null)
      console.log(`[${new Date().toISOString()}] CORS ${allowed ? '' : 'DIS'}ALLOWED ${origin}`)
    }
  }))
  app.use(express.json())
  // Logger & Static images access
  if (process.env.REDIRECT_URL) {
    app.use('/v1/[0-9]{4}/[0-9]{2}/[0-9]{2}/', createProxyMiddleware({ target: process.env.REDIRECT_URL, changeOrigin: false }))
  } else {
    app.use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
      const originalUrl = urlencode.decode(req.originalUrl, 'gbk')
      if (/(\.jpeg|\.jpg|\.png)$/.test(originalUrl)) {
        try {
          res.setHeader('Cache-Control', 'public, max-age=31536000')
          const cs = createReadStream(path.resolve(originalUrl.replace(/v[0-9]+/, 'upload').substring(1)))
          cs.on('data', (chunk) => {
            res.write(chunk)
          })
          
          cs.on('close', () => {
            res.status(200)
            res.end()
          })
        }catch(e) {
          console.error(e)
          res.status(404)
          res.end()
        }
      } else {
        next()
      }
    })
  }
  // Verify JWT
  app.use(async (req, res, next) => {
    if (!req.url.includes('/user/login') && !req.url.includes('/info') && !(await jwt.verify(req.headers.authorization?.split(' ')[1] || ''))) 
      result.unauthorized(res)
    else
      next()
  })
  app.use('/v1', router)

  app.listen(3011, () => {
    console.log('Server is listening on port 3011')
  })
})()


