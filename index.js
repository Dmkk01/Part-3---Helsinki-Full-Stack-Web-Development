const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const app = express()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

morgan.token('body', (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body)
  }
  });

app.use(morgan(':method :url :status - :response-time ms :body'));


// let persons = [
//   {
//     "name": "Arto Hellas",
//     "number": "040-123456",
//     "id": 1
//   },
//   {
//     "name": "Ada Lovelace",
//     "number": "39-44-5323523",
//     "id": 2
//   },
//   {
//     "name": "Dan Abramov",
//     "number": "12-43-234345",
//     "id": 3
//   },
//   {
//     "name": "Mary Poppendieck",
//     "number": "39-23-6423122",
//     "id": 4
//   },
//   {
//     "name": "Dom",
//     "number": "123",
//     "id": 5
//   },
//   {
//     "name": "231312",
//     "number": "13312",
//     "id": 8
//   }
// ]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })

app.get('/info', (req, res) => {
    let time = new Date()
    Person.find({}).then(people => {
      res.send(`<p>Phonebook has ${people.length} people </p><p>${time}</p>`)
    })
    
  })
  
  app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
      res.json(people)
    })
  })
  
  app.post('/api/persons', (request, response, next) => {
    const body = request.body
    // const check = persons.find(per => per.name === body.name)

    // if (check) {
    //   return response.status(400).json({ 
    //     error: 'name must be unique' 
    //   })
    // }
    // if (!body.name || !body.number) {
    //   return response.status(400).json({ 
    //     error: 'Missing name or number' 
    //   })
    // }
    if (body.name === undefined || body.number === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }
  
    const person = new Person({
      name: body.name,
      number: body.number
    })
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
    // persons = persons.concat(person)

    // response.json(person)
  })
  
  app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
      .then(person => {
        if (person) {
          response.json(person)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => {
        console.log("Error in getting the id of a person")
        next(error)
      })
    // const id = Number(request.params.id)
    // const person = persons.find(person => person.id === id)
  
    // if (person) {
    //   response.json(person)
    // } else {
    //   response.status(404).end()
    // }
  })
  
  app.delete('/api/persons/:id', (request, response, next) => {
    // const id = Number(request.params.id)
    // persons = persons.filter(person => person.id !== id)
  
    // response.status(204).end()
    Person.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })
  
  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

  app.use(unknownEndpoint)

  app.use(errorHandler)

  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })