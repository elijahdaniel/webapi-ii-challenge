const express = require('express')
const postRouter = require('./router/post-router.js')
const server = express()

server.use(express.json())
server.use('/api/posts', postRouter)

server.get('/', (req, res) => res.send('home'))

module.exports = server
