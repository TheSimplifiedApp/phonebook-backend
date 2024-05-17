const mongoose = require('mongoose')

const MONGODB_URL = process.env.MONGODB_URL

mongoose.set('strictQuery', false)

mongoose.connect(MONGODB_URL)
  .then(() => console.log('connected to MongoDB'))
  .catch(error => console.log('fail to connect to MongoDB:', error.message))

const phonebookSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      // validator: function (v) {
      //   return /\d{2,3}-\d{5,6}/.test(v)
      // },
      validator: (v) => /\d{2,3}-\d{5,6}/.test(v),
      message: props => `${props.value} is not a valid phone number xx-xxxxxx or xxx-xxxxx`
    },
    required: [true, 'phone number required']
  }
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id,
      delete returnedObject.__v
  }
})

module.exports = mongoose.model('Phonebook', phonebookSchema)