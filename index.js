const express = require('express')
var morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())

morgan.token('na', function getId(req) {
  if (req.body.name) {
    return `{ "name":"${req.body.name}","number":"${req.body.number}" }`
  }
  return " "
})

app.use(express.json()) 
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :na`))

let persons = [
  {
    name: "Aku Ankka",
    number: "020202",
    id: 1
  },
  {
    name: "Pelle Peloton",
    number: "0100100",
    id: 2
  },
  {
    name: "Roope-Setä",
    number: "050-21456-321",
    id: 3
  },
  {
    name: "Hannu Hanhi",
    number: "131-3217-1331",
    id: 4
  }
]

let info = {
    content: `<h1>Phonebook has info for ${persons.length} people</h1>`,
    date: new Date()
}

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(`${info.content} ${info.date}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name is missing' 
      })
    }
    if (!body.number) {
      return response.status(400).json({ 
        error: 'number is missing' 
      })
    }

    const p = persons.find(p => p.name === body.name)    
    if (p) {
        return response.status(400).json({ 
          error: 'Given name is already in use' 
        })
      }
  
    const person = {
      name: body.name,
      number: body.number,
      id: Math.random(1000),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})