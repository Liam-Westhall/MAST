const express = require('express')
const router = express.Router()

const {Student, User} = require('../../models')

router.get('/', async (req, res) => {

    var students = await Student.findAll({include:[User]})
    res.send(students)
})

//USE FOR TESTING. CAN DELETE LATER!!!!!!!!!
router.get('/new', async (req, res) => {

    try{

        await Student.create({
            sbuID: "123456789",
            department: "CSE",
            track: "Security",
            entrySemester: "2021",
            UserId: "1"
        })
        

    }catch (err) {
        console.log(err)
    }
   

    res.send("Student added!!!!")
})

module.exports = router;