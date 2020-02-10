const mongoose = require('mongoose')

if ( process.argv.length<5 && process.argv.length!=3) {
  console.log('missing password/name and/or number')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://Antero:${password}@cluster0-qvhbd.mongodb.net/phonebook?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if ( process.argv.length===3 ) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
} else {

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(response => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`);
    mongoose.connection.close();
  })
}