const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
let id = 111111111

const {Student, User} = require('../../models')

router.post('/', async(req, res) => {
    const {firstName, lastName, email, sbuID, major, entrySemester, track} = req.body;
    try {
        console.log(req)
        
        let usertemp = await User.update({
            firstName: firstName,
            lastName: lastName,
            email: email
           }, {where : {email: email}})

        let studenttemp = await Student.update({
            sbuID: sbuID,
            department: major,
            entrySemester: entrySemester,
            track: track
           }, {where : {sbuID: sbuID}})

        res.send({usertemp, studenttemp})
    }
    catch(error){
        throw error;
        res.status(500).send("error ocurred adding the sudent")
    }
})

module.exports = router;