const express = require('express')
const { request, response } = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body'))

morgan.token('body', function (request) {return JSON.stringify(request.body)})

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
]

// Used to get a random id
const generateId = () => {
  Math.floor(Math.random() * Math.floor(1000000))
}

// Gets the whole phonebook
app.get('/api/persons', (request, response) => {
  response.send(persons)
})

// Gets a specific person from the phonebook
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((person) => person.id === id)
  person ? response.json(person) : response.status(404).end()
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
  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }
  persons = persons.concat(newPerson)
  response.json(newPerson)
})

// Delete a contact from the phonebook
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((person) => person.id !== id)
  response.status(204).end()
})

// Renders info for the phonebook
app.get('/info', (request, response) => {
  response.send(
    `<div>
      <p>Phonebook has info of ${persons.length} people</p>
      <p>${new Date()}</p>
    </div>`
  )
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
