const mongoose = require('mongoose')
if (process.argv.length < 3) {
    console.log('provide password for operation')
    process.exit(1)
}

const password = process.argv[2]
console.log(`Password ${password}`)
const url =
    `mongodb+srv://jivan0608:${password}@reactcluster.dwec0vk.mongodb.net/?retryWrites=true&w=majority&appName=ReactCluster`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const userSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const User = mongoose.model('User', userSchema)

if (process.argv.length === 5) {
    console.log('saving User to the database')

    const user = new User({
        name: process.argv[3],
        number: process.argv[4],
    })
    user.save().then(result => {
        console.log(`Result ${result}`)
        mongoose.connection.close()
    })
}

if (process.argv.length === 3) {
    console.log('fetching data from database')

    User.find({}).then(result => {
        result.forEach(user => {
            console.log(JSON.stringify(user))
        })
        mongoose.connection.close()
    })
}





