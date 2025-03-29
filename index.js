const express = require('express')
const path = require('path')

const app = express()

const port = 3000

// Set up views directory and view engine PUG
app.set('views', path.join(__dirname, 'views')) // Set the views directory containing PUG files
app.set('view engine', 'pug') // Set PUG as the view engine

app.get('/', (req, res) => {
  res.render('client/pages/home', {
    pageTitle: 'Homepage'
  })
})

app.get('/tours', (req, res) => {
  res.render('client/pages/tour-list', {
    pageTitle: 'Tour List'
  })
})

app.listen(port, () => {
  console.log(`App server is running on port ${port}`)
})
