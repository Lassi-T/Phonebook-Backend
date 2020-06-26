require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body'))

morgan.token('body', function (request) {return JSON.stringify(request.body)})

// Used to get a random id
const generateId = () => {
  Math.floor(Math.random() * Math.floor(1000000))
}

// Gets the whole phonebook
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons.map(person => person.toJSON()))
  })
})

// Gets a specific person from the phonebook
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    person ? response.json(person) : response.status(404).end()
  })
})

// Add a new contact to the phonebook
app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Content missing',
    })
  }
  if (persons.find((person) => person.name === body.name)) {
    return response.status(403).json({
      error: 'Name must be unigue',
    })
  }
  const newPerson = new Person({
    name: body.name,
    number: body.number,
    id: generateId(),
  })

  newPerson.save().then(savedPerson => {
    response.json(savedPerson.toJSON())
  })
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

const PORT = process.env.PORT

app.listen(PORT || 3001, () => {
  console.log(`Server running on port ${PORT}`)
})
