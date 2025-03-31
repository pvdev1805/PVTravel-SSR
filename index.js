const express = require('express')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config()

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE)

const homeController = require('./controllers/client/home.controller')
const tourController = require('./controllers/client/tour.controller')

const app = express()

const port = 3000

// Set up views directory and view engine PUG
app.set('views', path.join(__dirname, 'views')) // Set the views directory containing PUG files
app.set('view engine', 'pug') // Set PUG as the view engine

// Set up static files directory
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', homeController.home)

app.get('/tours', tourController.list)

app.listen(port, () => {
  console.log(`App server is running on port ${port}`)
})
