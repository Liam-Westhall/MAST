const express = require('express')
const router = express.Router()

const {Student, User} = require('../../models')

router.get('/', async (req, res) => {

    var students = await Student.findAll({include:[User]})
    res.send(students)
})

router.get('/search?', async (req, res) => {

    var student_obj = {}
    var user_obj = {}
    var filters = req.query
   
    for (const [key, value] of Object.entries(filters)) {
    
        if (key == "firstName" || key == "lastName" || key == "email"){
            user_obj[key] = value 
        }else {
            student_obj[key] = value 
        }
         
    }

    var students = await Student.findAll({include: [{model: User, where: user_obj }], where: student_obj })
    res.send(students)
})

router.post('/delete_all', async (req, res) => {
    await Student.destroy({
        truncate: true
    });
}
)


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