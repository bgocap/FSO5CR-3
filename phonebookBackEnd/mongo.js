const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('Give password as argument')
  process.exit(1)
}
const password = process.argv[2]
const url=
`mongodb://fullstack:${password}@ac-3qeirql-shard-00-00.danzwxs.mongodb.net:27017,ac-3qeirql-shard-00-01.danzwxs.mongodb.net:27017,ac-3qeirql-shard-00-02.danzwxs.mongodb.net:27017/phonebookApp?ssl=true&replicaSet=atlas-75rjcg-shard-0&authSource=admin&retryWrites=true&w=majority`
//const url1 =`mongodb+srv://fullstack:${password}@cluster0.danzwxs.mongodb.net/phonebookApp?retryWrites=true&w=majority`
mongoose.set('strictQuery',false)
mongoose.connect(url)


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv[3]||process.argv[4]){
  const newPersonName = process.argv[3]
  const newPersonNumber = process.argv[4]
  const person = new Person({
    name: newPersonName,
    number: newPersonNumber,
  })
  person.save().then(result => {
      console.log(`added ${newPersonName} number ${newPersonNumber} to phonebook`)
      mongoose.connection.close()
  })
}else{
  Person.find({}).then(result => {
    console.log('phonebook')
    result.forEach(prsn => {
      console.log(`${prsn.name} ${prsn.number}`)
    })
    mongoose.connection.close()
  })

}



