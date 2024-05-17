require('dotenv').config()

const express = require('express')
const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())

const morgan = require('morgan')
morgan.token('request_body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request_body'))

const Phonebook = require('./models/phonebook')

app.use(express.static('dist'))

app.get('/api/phonebook', (_req, res) => {
  Phonebook
    .find({})
    .then(results => res.json(results))
})

app.get('/api/phonebook/:id', (req, res, next) => {
  Phonebook
    .findById(req.params.id)
    .then(person => {
      console.log(person)
      if (person) {
        res.json(person)
      } else {
        res.status(404).end
      }
    })
    .catch(error => next(error))
})

app.post('/api/phonebook', (req, res, next) => {
  const { name, number } = req.body

  const newPerson = new Phonebook({ name, number })

  newPerson
    .save()
    .then(returnedPerson => res.json(returnedPerson))
    .catch(error => next(error))
})

app.put('/api/phonebook/:id', (req, res, next) => {

  const { name, number } = req.body

  Phonebook
    .findByIdAndUpdate(req.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => res.json(updatedPerson))
    .catch(error => next(error))
})

app.delete('/api/phonebook/:id', (req, res) => {
  Phonebook
    .findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
})

const unknownEndpoint = (req, res) => {
  res.status(400).json({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`)
})