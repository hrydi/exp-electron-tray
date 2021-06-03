const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)

const host = '0.0.0.0'
const port = 3456

app.set('Host', host)
app.set('Port', port)

app.get('/', (req, res) => res.send('Expres App'))

module.exports = { app, server }