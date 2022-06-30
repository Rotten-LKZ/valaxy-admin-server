import { Response } from 'express'

export default {
  succ(data: object = {}, res: Response) {
    res.json({
      code: 200,
      data,
    })
  },
  unauthorized(res: Response) {
    res.status(401).json({
      code: 401,
      data: {}
    })
  },
  badRequest(res: Response) {
    res.status(400).json({
      code: 400,
      data: {}
    })
  }
}
