const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
let id = 111111111

const {Student, User} = require('../../models')

router.post('/', async(req, res) => {
    const {firstName, lastName, email, password, department, entrySemester, track} = req.body;
    try {

        let check = await User.findOne({where : {email: email}})
        
        if (check) {
            return res.status(409).send("User already exists")
        }

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

        res.send({name: user.firstName + " " + user.lastName})
    }
    catch(error){
        throw error;
        res.status(500).send("error ocurred adding the sudent")
    }
})

module.exports = router;