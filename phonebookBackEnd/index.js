const express = require('express')
var morgan = require('morgan')
const cors = require('cors')


morgan.token('body', function(req,res){return JSON.stringify(req.body)})
const log = morgan(':method :url :status :res[content-length] - :response-time ms :body')

const app = express()

app.use(express.json())
app.use(log)
app.use(cors())

let persons=
[
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

const getRandomNumber = () => Math.floor(Math.random() * 1000)

const generateId =()=>{
    let newId=getRandomNumber()
    //console.log('new random number is: ',newId)
    while(persons.some(prsn=>prsn.id===newId)){
        newId=getRandomNumber()
    }
    return newId
}

app.post('/api/persons', (request,response)=>{

  const body = request.body
  if (!body.name || !body.number) {
      return response.status(400).json({
        error: 'data missing'
      })
  }

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
})

app.get('/info', (request, response) => {
  const date= new Date
  const message=`Phone book has info for ${persons.length} people<br/><br/>${date}`
  response.send(message)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(prsn => prsn.id === id)
  console.log(id)
  if (person) {
      response.json(person)
  } else {
      response.status(404).end()
  }

  //console.log(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(prsn => prsn.id !== id)

    response.status(204).end()
})



const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)