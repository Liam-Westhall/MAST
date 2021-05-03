const express = require('express')
const stream = require('stream')
const fs = require('fs')
const csv = require('csv-parser')
const {Op, json} = require("sequelize")

const {Course, Degree, Student, User, Student_Course, Sequelize} = require('../../models')
const db = require('../../models')
const bodyParser = require("body-parser");

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        let courses = await Course.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('courseNumber')), "courseNumber"],
                "department"
            ]
        }).catch((err) => console.log('caught it'));
        res.send(courses);
    } catch (error) {
        console.log(error)
        res.status(500).send("COURSE LIST ERR")
    }
})

router.get('/course?', async (req, res) => {

    try{

        let course = await Course.findOne({where: {courseNumber: req.query.number, department: req.query.name}})
        res.send(course)
    }catch{
        console.log(error)
        res.status(500).send("Could not find course")
    }
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
        }).catch((err) => console.log('caught it'));

        res.send(courses)
    } catch (error) {
        console.log(error)
        res.status(500).send("COURSE LIST ERR")
    }
    
})


router.post('/getgrades', async (req, res) => {
    try {
        const {id} = req.body;
        console.log(id);
        let grades = await Student_Course.findAll({
            where: {
                StudentId: id
            }
        }).catch((err) => console.log(err));
        res.send(grades)
    } catch(error) {
        console.log(error)
        res.status(500).send("GET GRADES ERR")
    }
})

router.post('/getallgrades', async (req, res) => {
    try {
        let grades = await Student_Course.findAll().catch((err) => console.log(err));
        res.send(grades);
    }
    catch(error) {
        console.log(error)
        res.status(500).send("GET GRADES ERR")
    }
})

router.post('/checkcompleted', async (req, res) => {
    try{
        const {department, courseNum, studentID} = req.body;

        let grade = await Student_Course.findOne({
            where: {
                StudentId: studentID,
                department: department,
                course_num: courseNum
            }
        }).catch((err) => console.log('caught it'))
        res.send(grade)
    } catch(error) {
        console.log(error)
        res.status(500).send("CHECK COMPLETED ERR")
    }
})

module.exports = router;