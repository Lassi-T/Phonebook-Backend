const express = require('express')
const { request, response } = require('express')
const app = express()

const PORT = 3001

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
]

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  person ? response.json(person) : response.status(404).end()
})

app.get('/api/persons', (request, response) => {
  response.send(persons)
})

app.get('/info', (request, response) => {
  response.send(
    `<div>
      <p>Phonebook has info of ${persons.length} people</p>
      <p>${new Date()}</p>
    </div>`
  )
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})