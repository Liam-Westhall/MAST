const express = require('express')

const app = express()


app.get('/', (req, res) => {
    res.send('We are live baby')
}) 

app.listen(8000, () => {
    console.log(`Listening to http://localhost:8000`)
})