const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('password missing')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://admin:${password}@cluster0.vk4geaf.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', phonebookSchema)

if (process.argv.length === 5) {
  const newPerson = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  newPerson
    .save()
    .then(result => {
      console.log(result)
      mongoose.connection.close()
    })
} else {
  Person
    .find({})
    .then(result => {
      result.forEach(p => console.log(p))
      mongoose.connection.close()
    })
}

