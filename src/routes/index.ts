import exp from 'constants'
import express from 'express'
import infoRouter from './info'
import userRouter from './user'
import articleRouter from './article'

const router = express.Router()

router.use('/info', infoRouter)
router.use('/user', userRouter)
router.use('/article', articleRouter)

export default router
