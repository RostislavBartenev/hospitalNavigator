const express = require('express')
const path = require('path')
const hbs = require('hbs')
const indexRouter = require('./src/routes/index')

const app = express()

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'src', 'views'))
hbs.registerPartials(path.join(__dirname, 'src', 'views', 'partials'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/', indexRouter)

module.exports = app