const path    = require('path')
const express = require('express')
const _config = require('./config.electron')

const app = express()

app.use(express.static(path.join(__dirname, './')))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'))
})

app.listen(_config.port, _config.host, err => {
  if (err) {
    throw new Error(err)
  }

  console.log(`start server for http://${_config.host}:${_config.port}`)
})
