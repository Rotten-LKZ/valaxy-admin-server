import { Db, MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGO_LINK || '')

let dbConnection: Db

export default {
  connectToServer() {
    return new Promise((resolve) => {
      client.connect((err, db) => {
        if (err || !db) {
          resolve(false)
          return
        } 
        dbConnection = db.db(process.env.MONGO_DBNAME)
        console.log('Connected to MongoDB')

        resolve(true)
      })
    })
  },

  getDb() {
    return dbConnection
  }
}
