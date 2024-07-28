const express = require('express')
const app = express()
const User = require('./models/user')
require('dotenv').config()
const cors = require('cors')
const morgan = require('morgan')
morgan.token('recordName',  (req, res) => { return JSON.stringify(req.body) })
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
        response.json(user)
      })
})

app.delete('/api/persons/:id', (request, response) => {
    User.findByIdAndDelete(request.params.id).them(()=>{
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})