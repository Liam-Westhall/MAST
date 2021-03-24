const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
let id = 111111111

const {Student, User} = require('../../models')

router.post('/', async(req, res) => {
    const {firstName, lastName, email, password, department, entrySemester, track} = req.body;
    try {
        let user = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            isStudent: true
        });

        let student = await Student.create({
            sbuID: id.toString(),
            department: department,
            track: track,
            entrySemester: entrySemester,
            UserId: user.id
        });

        id = id + 1;
        useID = useID + 1;

        res.send({name: user.firstName + " " + user.lastName})
    }
    catch(error){
        throw error;
    }
})

module.exports = router;