const express = require('express')
const morgan = require('morgan')
const app = express()


app.use(express.json())
morgan.token('body', (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body)
  }
  });
app.use(morgan(':method :url :status - :response-time ms :body'));



let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  },
  {
    "name": "Dom",
    "number": "123",
    "id": 5
  },
  {
    "name": "231312",
    "number": "13312",
    "id": 8
  }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })

app.get('/info', (req, res) => {
    let time = new Date()
    res.send(`<p>Phonebook has ${persons.length} people </p><p>${time}</p>`)
  })
  
  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })
  
  const generateId = () => {
    const maxId = Math.floor(Math.random() * 100000)
    return maxId 
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
    const check = persons.find(per => per.name === body.name)

    if (check) {
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'Missing name or number' 
      })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
    persons = persons.concat(person)

    response.json(person)
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
  
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })