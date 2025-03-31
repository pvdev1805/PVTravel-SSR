const express = require('express')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config()

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE)

const Tour = mongoose.model('Tour', {
  name: String,
  vehicle: String
})

const app = express()

const port = 3000

// Set up views directory and view engine PUG
app.set('views', path.join(__dirname, 'views')) // Set the views directory containing PUG files
app.set('view engine', 'pug') // Set PUG as the view engine

// Set up static files directory
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.render('client/pages/home', {
    pageTitle: 'Homepage'
  })
})

app.get('/tours', async (req, res) => {
  const tourList = await Tour.find({})
  console.log(tourList)

  res.render('client/pages/tour-list', {
    pageTitle: 'Tour List',
    tourList: tourList
  })
})

app.listen(port, () => {
  console.log(`App server is running on port ${port}`)
})
