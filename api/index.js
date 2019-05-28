'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const jwt = require('jsonwebtoken')

const app = express()
module.exports = app

app.use(helmet())
app.use(bodyParser.json())

function verifyToken (req, res, next) {
  const authorizationHeader = req.headers['authorization']
  const storeAuthorizationHeader = req.headers['store-authorization']

  if (authorizationHeader == null) {
    res.status(403).send({ error: 'unauthorized to make this request' })
    return
  }

  const token = authorizationHeader.split(' ')[1]
  const clientKey = storeAuthorizationHeader

  req.token = token
  req.clientKey = clientKey
  
  next()
}

app.post('*', verifyToken, (req, res) => {  
  jwt.verify(req.token, req.clientKey, function(err, decoded) { // bar
    res.set('Content-Type', 'application/json')

    if (err) {
      return res.status(403).send({ error: 'Unable to authorize', err })
    }

    return res.status(200).send({decoded, body: req.body, message: 'Authorized Post Created '})
  });

})

app.all('*', (req, res) => {
  res.status(405).send({ error: 'only POST requests are accepted' })
})