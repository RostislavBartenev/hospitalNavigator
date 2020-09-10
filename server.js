require('dotenv').config()
const app = require('./app')
const mongoose = require('mongoose')

const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
  autoIndex: true,
  poolSize: 10,
  bufferMaxEntries: 0,
}

const {
  DB_PASSWORD,
  DB_NAME,
  DB_USER,
  DB_PORT,
} = process.env

const dbConnectionURL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.pfafj.mongodb.net/${DB_NAME}?retryWrites=true&w=majority}`

let dbConnect = () => {
  mongoose.connect(dbConnectionURL, options, (err) => {
    if (err) return console.log(err);
    console.log('DB connected');
  })
}

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log('Server started on port', PORT);
})

dbConnect()
