let express = require('express')
let bodyParser = require('body-parser')
let mongoose = require('mongoose')
let app = express()
let path = require('path')

let sauceRoutes = require('./routes/sauce')
let userRoutes = require('./routes/User')

mongoose.connect('mongodb+srv://monsieurchang:azerty@cluster0.tlmzufi.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

app.use(express.json())
app.use(bodyParser.json())

app.use('/api/sauces', sauceRoutes)
app.use('/api/auth', userRoutes)
app.use('/images', express.static(path.join(__dirname, 'images'))) //chemin statique pour fournir les img à l'app

module.exports = app



