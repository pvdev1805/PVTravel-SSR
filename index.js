const express = require('express')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config()

const database = require('./config/database')

const adminRoutes = require('./routes/admin/index.route')
const clientRoutes = require('./routes/client/index.route')

const variableConfig = require('./config/variable')

const app = express()

const port = 3000

// Connect to the database
database.connect()

// Set up views directory and view engine PUG
app.set('views', path.join(__dirname, 'views')) // Set the views directory containing PUG files
app.set('view engine', 'pug') // Set PUG as the view engine

// Set up static files directory
app.use(express.static(path.join(__dirname, 'public')))

// Set up local variables for PUG templates
app.locals.pathAdmin = variableConfig.pathAdmin

// Parse JSON request body
app.use(express.json())

// Set up admin routes
app.use(`/${variableConfig.pathAdmin}`, adminRoutes)

// Set up client routes
app.use('/', clientRoutes)

app.listen(port, () => {
  console.log(`App server is running on port ${port}`)
})
