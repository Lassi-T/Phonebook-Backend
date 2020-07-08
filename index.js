const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

require('dotenv').config()

const Person = require('./models/person')

const app = express()

const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: 'Unknown endpoint'
  })
}

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted id' })
  } 
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

morgan.token('body', function (request) {
  return JSON.stringify(request.body)
})

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body'))

// Gets the whole phonebook
app.get('/api/persons', (request, response, next) => {
  Person.find({}).then((persons) => {
    response.json(persons.map((person) => person.toJSON()))
  })
  .catch(error => next(error))
})

// Gets a specific person from the phonebook
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      person ? response.json(person) : response.status(404).end()
    })
    .catch((error) => next(error))
})

// Used to get a random id
const generateId = () => {
  const max = 1000000
  Math.floor(Math.random() * Math.floor(max))
}

// Add a new contact to the phonebook
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'Name missing',
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'Number missing',
    })
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
    id: generateId(),
  })

  newPerson.save().then((savedPerson) => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})

// Update existing person in phonebook
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const updatedPerson = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, updatedPerson, {new: true})
    .then(result => {
      response.json(result.toJSON())
    })
    .catch(error => next(error))
})

// Delete a contact from the phonebook
app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id).then(() => {
    response.status(204).end()
  })
})

// Renders info for the phonebook
app.get('/info', (request, response) => {
  response.send(
    `<div>
      <p>Phonebook has info of ${persons.length} people</p>
      <p>Request received on ${new Date()}</p>
    </div>`
  )
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT || 3001, () => {
  console.log(`Server running on port ${PORT}`)
})
