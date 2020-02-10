require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const app = express()
const Person = require('./models/person')
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))

morgan.token('na', function getId(req) {
  if (req.body.name) {
    return `{ "name":"${req.body.name}","number":"${req.body.number}" }`
  }
  return " "
})

app.use(express.json()) 
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :na`))

let info = {
    content: `<h1>Phonebook has info for ${Person.length} people</h1>`,
    date: new Date()
}

app.get('/', (req, res) => {
  res.send('<h1>Nothing here!</h1>')
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(person => {
        res.json(person.map(p => p.toJSON()))
      })
})

app.get('/info', (req, res) => {
    res.send(`${info.content} ${info.date}`)
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
      if (person) {
        response.json(person.toJSON())
      } else {
        next()
      }
      }).catch(error => next(error))
  })

  app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    }).catch(error => next())
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
        name: body.name,
        number: body.number,
      }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(newPerson => {
        response.json(newPerson.toJSON())
      })
      .catch(error => next(error))
  })

  app.post('/api/persons', (request, response, next) => {
    const body = request.body
  
    const person =  new Person({
      name: body.name,
      number: body.number,
    })
  
    person.save().then(newPerson => {
        response.json(newPerson.toJSON())
      }).catch(error => next(error))
    
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint, may not exist anymore' })
  }

  app.use(unknownEndpoint)

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
  app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})