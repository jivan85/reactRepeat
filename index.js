const express = require('express')
const app = express()
const User = require('./models/user')
require('dotenv').config()
const cors = require('cors')
const morgan = require('morgan')
morgan.token('recordName', (req, res) => { return JSON.stringify(req.body) })
app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms name :recordName'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  User.find({}).then(users => {
    response.json(users)
  })
})


app.get('/api/persons/:id', (request, response) => {
  User.findById(request.params.id).then(user => {
    if (user) {
      response.json(user)
    }
    else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  User.findByIdAndDelete(request.params.id).then(() => {
    response.status(204).end()
  })
})

app.post('/api/persons', (request, response) => {

  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }

  const user = new User({
    name: body.name,
    number: body.number
  })

  user.save().then(savedUser => {
    response.json(savedUser)
  })
})

app.put('/api/persons/:id', (request, response) => {

  const body = request.body
  const filter = { name: body.name };
  const update = { number: body.number };

  User.findOneAndUpdate(filter, update, {
    returnOriginal: false
  }).then(savedUser => {
    if (savedUser) {
      response.json(savedUser)
    }
    else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  User.find({}).then(users => {
    response.send(`<p>Phonebook has info for ${users.length} people</p> ${new Date()}`)
  })
 
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})