const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()

const routes = require('./src/index')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get(['/', '/v1', '/ping', '/v1/ping'], (req, res, next) => {
  return res.status(200).json({
    message: 'Pirpos IMG API'
  })
})

app.use('/v1', routes)

// Error Handler
app.use((err, req, res, next) => {
  if (err.status === 500) {
    res.status(500).json({
      message: 'Tenemos problemas con el servidor. Se ha creado una notificacion al área de soporte sobre este error. Gracias por tu paciencia'
    })
  } else {
    res.status(err.status || 500).json({
      message: err.message
    })
  }
})

// 404 Resolution
app.use((req, res, next) => {
  return res.status(404).json({
    error: 'Not Found'
  })
})

module.exports.handler = serverless(app)
