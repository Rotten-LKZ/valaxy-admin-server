import 'dotenv/config'
import cors from 'cors'
import dbo from './db/conn'
import router from './routes'
import express from 'express'
import jwt from './utils/jwt'
import result from './utils/result'


;(async () => {
  const dbConn = await dbo.connectToServer()
  if (dbConn === false) {
    console.error('Failed to connect to MongoDB')
    return
  }

  const app = express()
  app.use(cors({
    origin: (origin, cb) => {
      const whitelist = ['http://172.23.105.100:3000']
      const allowed = whitelist.indexOf(origin || 'abracadabra') !== -1
      if (allowed)
        cb(null, true)
      else
        cb(null)
      console.log(`[${new Date().toISOString()}] CORS ${allowed ? '' : 'DIS'}ALLOWED ${origin}`)
    }
  }))
  app.use(express.json())
  // Logger & Verify JWT
  app.use(async (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    if (!req.url.includes('/user/login') && !(await jwt.verify(req.headers.authorization?.split(' ')[1] || ''))) 
      result.unauthorized(res)
    else
      next()
  })
  app.use('/v1', router)

  app.listen(3011, () => {
    console.log('Server is listening on port 3011')
  })
})()


