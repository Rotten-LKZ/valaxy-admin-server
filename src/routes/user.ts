import express from 'express'
import jwt from '../utils/jwt'
import result from '../utils/result'

const router = express.Router()

router.post('/login', (req, res) => {
  const { username, password } = req.body
  if (username === process.env.MANAGER_USERNAME && password === process.env.MANAGER_PASSWORD) {
    result.succ({
      status: true,
      token: jwt.generate({ username }),
    }, res)
  } else {
    result.succ({
      status: false,
      token: '',
    }, res)
  }
})

export default router
