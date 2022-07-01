import express from 'express'
import infoRouter from './info'
import userRouter from './user'
import imageRouter from './image'
import articleRouter from './article'

const router = express.Router()

router.use('/info', infoRouter)
router.use('/user', userRouter)
router.use('/article', articleRouter)
router.use('/image', imageRouter)

export default router
