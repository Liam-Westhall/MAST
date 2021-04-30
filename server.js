const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

const app = express()
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(fileUpload())

const db = require('./models')

// app.get('/express_backend', (req, res) => {
//     res.send({express: 'We are live baby'});
// }) 

app.use("/api/users", require("./routes/api/users"))
app.use("/api/students", require("./routes/api/students"))
app.use("/api/auth", require("./routes/api/auth"))
app.use("/api/courses", require("./routes/api/courses"))
app.use("/api/add_student", require("./routes/api/add_student"))
app.use("/api/edit_student", require("./routes/api/edit_student"))
app.use("/api/uploadfiles", require("./routes/api/files"))
app.use("/api/degrees", require("./routes/api/degrees"))
app.use("/api/comments", require("./routes/api/comments"))

db.sequelize.sync({ alter: true }).then((req) => {

    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    })
})
