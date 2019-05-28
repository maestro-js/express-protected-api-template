'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const jwt = require('jsonwebtoken')

const app = express()
module.exports = app

app.use(helmet())
app.use(bodyParser.json())


app.post('*', (req, res) => {
  // GET USER SHOULD RETURN KEY
  const user = {
    id: 1,
    username: 'name',
    email: 'email@email.com',
    key: 'Port Modestaberg'
  }

  jwt.sign({user}, user.key, {expiresIn: '15m'}, (err, token) => {
    res.set('Content-Type', 'application/json')
    res.status(200).send({user, token, body: req.body})
  })
})

app.all('*', (req, res) => {
  res.status(405).send({ error: 'only POST requests are accepted' })
})