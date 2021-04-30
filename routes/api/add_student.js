const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
let id = 111111111

const {Student, User} = require('../../models')

router.post('/', async(req, res) => {
    const {firstName, lastName, email, password, department, entrySemester, track, graduation_semester, graduation_year} = req.body;
    try {

        let check = await User.findOne({where : {email: email}}).catch((err) => console.log('caught it'));
        let req_semester = ""
        let req_year = ""
        if (check) {
            return res.status(409).send("User already exists")
        }

        if(entrySemester.charAt(0) == "F"){
            req_semester = "Fall"
        }
        else if(entrySemester.charAt(0) == "S"){
            req_semester = "Spring"
        }
        req_year = (2000 + parseInt(entrySemester.substring(1))).toString();
        let user = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            isStudent: true
        }).catch((err) => console.log('caught it'));

        let student = await Student.create({
            sbuID: id.toString(),
            department: department,
            track: track,
            entrySemester: entrySemester,
            graduation_semester, graduation_semester,
            graduation_year: graduation_year,
            requirement_version_semester: req_semester,
            requirement_version_year: req_year,
            UserId: user.id
        }).catch((err) => console.log('caught it'));

        id = id + 1;

        res.send({name: user.firstName + " " + user.lastName})
    }
    catch(error){
        throw error;
        res.status(500).send("error ocurred adding the sudent")
    }
})

module.exports = router;