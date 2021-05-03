const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
let id = 111111111

const {Student, User} = require('../../models')

router.post('/', async(req, res) => {
    const {userID, studentID, firstName, lastName, email, sbuID, major, entrySemester, track} = req.body;
    try {
        console.log(req)
        
        let usertemp = await User.update({
            firstName: firstName,
            lastName: lastName,
            entrySemester: entrySemester,
            email: email
           }, {where : {id: userID}}).catch((err) => console.log('caught it'));

        let studenttemp = await Student.update({
            department: major,
            track: track,
            sbuID: sbuID
           }, {where : {id: studentID}}).catch((err) => console.log('caught it'));

        res.send({usertemp});
    }
    catch(error){
        throw error;
        res.status(500).send("error ocurred adding the sudent")
    }
})

router.post('/addCoursePlan', async (req, res) =>{

    const {studentID, coursePlan} = req.body
    console.log("UPDATING COURSE PLAN OF " + studentID)
    console.log(coursePlan);
    if(!studentID || !coursePlan) res.status(400).send("could not update course plan")

    try {
        await Student.update({coursePlan: coursePlan}, {where: {sbuID: studentID}})
        res.send("success")
    } catch (error) {
        res.status(500).send("could not update course plan")
    }
})

module.exports = router;