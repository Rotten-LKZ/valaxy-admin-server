import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.MANAGER_SECRET_KEY || 'abracadabra'

function generate(payload: object) {
  return `Bearer ${jwt.sign(payload, SECRET_KEY, { expiresIn: '30 days' })}`
}

function verify(token: string) {
  return new Promise((resolve) => {
    jwt.verify(token, SECRET_KEY, (err: any) => {
      if (err)
        resolve(false)
      resolve(true)
    })
  })
  
}

export default {
  generate, verify
}
