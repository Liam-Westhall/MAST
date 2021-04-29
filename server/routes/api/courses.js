const express = require('express')
const stream = require('stream')
const fs = require('fs')
const csv = require('csv-parser')
const {Op, json} = require("sequelize")

const {Course, Degree, Student, User, Student_Course} = require('../../models')
const db = require('../../models')
const bodyParser = require("body-parser");

const router = express.Router()

router.get('/', async (req, res) => {
    res.send("Test")
})

router.post('/courselist', async (req, res) => {
    try {
        const {department, courselist, semesters} = req.body;

        let courses = await Course.findAll({
            attributes: ['courseNumber', 'semester', 'totalStudents'],
            where: { 
                department: department,
                semester: {[Op.in]: semesters.split(',') }
            },
            raw: true
        })

        res.send(courses)
    } catch (error) {
        console.log(error)
        res.status(500).send("COURSE LIST ERR")
    }
    
})

router.post('/getgrades', async (req, res) => {
    try {
        const {id} = req.body;

        let grades = await Student_Course.findAll({
            where: {
                StudentId: id
            }
        });
        res.send(grades)
    } catch(error) {
        console.log(error)
        res.status(500).send("GET GRADES ERR")
    }
})

module.exports = router;