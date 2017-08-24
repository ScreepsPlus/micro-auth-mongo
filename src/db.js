const { MongoClient } = require('mongodb')

const MONGO_HOST = process.env.MONGO_HOST || 'mongo'
const MONGO_PORT = process.env.MONGO_PORT || '27017'
const MONGO_DB = process.env.MONGO_DB || 'service'


module.exports = {
  async get(col) {
    if (!this.db) {
      this.db = await MongoClient.connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`)
    }
    return this.db.get(col)
  }
}