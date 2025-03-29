const express = require('express')

const app = express()

const port = 3000

app.get('/', (req, res) => {
  res.send('Homepage')
})

app.get('/tours', (req, res) => {
  res.send('Tours List')
})

app.listen(port, () => {
  console.log(`App server is running on port ${port}`)
})
