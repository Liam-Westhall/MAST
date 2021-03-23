const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

const db = require('./models')

// app.get('/express_backend', (req, res) => {
//     res.send({express: 'We are live baby'});
// }) 

app.use("/api/users", require("./routes/api/users"))
app.use("/api/students", require("./routes/api/students"))
app.use("/api/auth", require("./routes/api/auth"))

db.sequelize.sync().then((req) => {

    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    })
})
