const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
let id = 111111111

const {Student, User} = require('../../models')

router.post('/', async(req, res) => {
    const {firstName, lastName, email, password, department, entrySemester, track} = req.body;
    try {
        await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            isStudent: true
        });

        await Student.create({
            sbuID: id.toString(),
            department: department,
            track: track,
            entrySemester: entrySemester
        });

        id = id + 1;
    }
    catch(error){
        throw error;
    }
})

module.exports = router;