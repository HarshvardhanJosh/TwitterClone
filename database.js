const mongoose = require('mongoose')

class Database {
  constructor() {
    this.connect()
  }
  connect() {
    mongoose
      .connect(
        'mongodb+srv://twitterclone:twitterclone11@twitterclonecluster.nyuafhn.mongodb.net/?retryWrites=true&w=majority'
      )
      .then(() => {
        console.log('connected to db')
      })
      .catch((err) => {
        console.log('error' + err)
      })
  }
}
module.exports = new Database()
