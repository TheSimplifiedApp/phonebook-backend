const express = require('express')
const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())

const morgan = require('morgan')
morgan.token('request_body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request_body'))

let phonebook = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/', (_req, res) => {
  res.send('Phonebook App')
})

app.get('/api/phonebook', (_req, res) => {
  res.json(phonebook)
})

app.get('/api/phonebook/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = phonebook.find(p => p.id === id)
  if (!person) {
    res.status(404).json({ error: "no match found" })
  }
  res.json(person)
})

app.post('/api/phonebook', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  if (phonebook.find(p => p.name === body.name)) {
    return res.status(400).json({ error: `${body.name} already exist` })
  }

  const newPerson = {
    id: Math.max(...phonebook.map(p => p.id)) + 1,
    name: body.name,
    number: body.number
  }

  phonebook = phonebook.concat(newPerson)

  res.json(newPerson)
})

app.put('/api/phonebook/:id', (req, res) => {

  const body = req.body
  if (!body.number) {
    return res.status(400).json({ error: 'number missing' })
  }

  const id = Number(req.params.id)
  const personToUpdate = phonebook.find(p => p.id === id)

  if (personToUpdate) {
    const updatedPerson = { ...personToUpdate, ...body }
    phonebook.map(p => p === id ? updatedPerson : p)
    return res.json(updatedPerson)
  }

  res.status(404).json({ error: 'no match found' })
})

app.delete('/api/phonebook/:id', (req, res) => {
  const id = Number(req.params.id)
  phonebook = phonebook.filter(p => p.id !== id)
  res.status(204).end()
})

const unknownEndpoint = (req, res) => {
  res.status(400).json({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`)
})