require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/Person')

morgan.token('body', function(req,res){return JSON.stringify(req.body)})
const log = morgan(':method :url :status :res[content-length] - :response-time ms :body')

const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(log)

//ADD NEW PERSON
app.post('/api/persons', (request,response,next)=>{

  const body = request.body  
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'data missing'
    })
  }
  /*
  if (persons.some(prsn=>prsn.name===body.name)){
    return response.status(400).json({
      error: 'The name already exists in the phonebook'
    })
  }
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }
  persons = persons.concat(person)
  response.json(person)
  */
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then(result => {
    console.log(`added ${body.name} number ${body.number} to phonebook`)
    response.json(person)
  }).catch(error => next(error))
})

/*
//GET PAGE STATUS
app.get('/info', (request, response) => {
  const date= new Date
  const message=`Phone book has info for ${persons.length} people<br/><br/>${date}`
  response.send(message)
})*/

//GET ALL PEOPLE
app.get('/api/persons', (request, response) => {
  Person.find({}).then(psrns => {
    response.json(psrns)
  }).catch(error => next(error))
})

/*
//GET BY ID
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(prsn => prsn.id === id)
  //console.log(id)
  if (person) {
      response.json(person)
  } else {
      response.status(404).end()
  }

  //console.log(person)
  //response.json(person)
})
*/

//DELETE PERSON BY ID
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      //console.log('Person deleted')
      response.status(204).end()
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)