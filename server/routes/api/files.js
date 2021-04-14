const express = require('express')
const stream = require('stream')
const fs = require('fs')
const csv = require('csv-parser')
const {Op, json} = require("sequelize")
const router = express.Router()

const {Course, Degree, Student, User, Student_Course} = require('../../models')
const db = require('../../models')

router.get('/', async (req, res) => {


    res.send("File test")
})

router.post('/degree_req', async (req, res) => {
    try{
        if(!req.files) res.status(500).send({error: "No file"});
        const file = req.files.file;
        const results = [];
        const departments = ['CSE', 'AMS', 'CE', 'BMI'];

        let degree_json = JSON.parse(file.data);
        console.log(degree_json);
        console.log(degree_json.name);
        
        let name_check = await Degree.findOne({where: {department: degree_json.name}});

        if(name_check){
            await Degree.update({
                json: degree_json
               }, {where : {department: degree_json.name}})
        }
        else{
            await Degree.create({
                department: degree_json.name,
                track: degree_json.version,
                json: degree_json
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send("error")
    }
})

router.post('/course', async (req, res) => {


    //console.log(req.body.file)
    // console.log(req.files.file)

    try{

        if(!req.files) res.status(500).send({error: "No file"})
        const file = req.files.file
        const results = []
        const departments = ['CSE', 'AMS', 'CE', 'BMI']


        var bufferStream = new stream.PassThrough()
        bufferStream.end(file.data)

        bufferStream.pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            await Course.destroy({truncate: true})
            for (const data in results){

                console.log(data)
                if (results[data].semester !== 'Fall' && results[data].semester !== 'Spring') throw results[data].semester + 'Semester string is not correct'
                if (departments.indexOf(results[data].department) <= -1) throw 'Not a correct department'

                await Course.create({
                    department: results[data].department,
                    courseNumber: results[data].course_num,
                    semester: (results[data].semester === 'Fall' ? 'F' + results[data].year.slice(-2) : 'S' + results[data].year.slice(-2)) ,
                    section:parseInt(results[data].section),
                    days: results[data].timeslot,
                    name: '',
                    description: '',
                    credits: 0
                })

            }
           
        });
        
        
        res.send("Succesful")
    }catch (error) {
        console.log(error)
        res.status(500).send("error")
    }
})


router.post('/student_data', async (req, res) => {


    //console.log(req.body.file)
    // console.log(req.files.file)

    try{

        if(!req.files) res.status(500).send({error: "No file"})
        const studentProfile = req.files.studentProfile
        const studentCoursePlan = req.files.studentCoursePlan
        const results = []
    


        var studentProfile_bufferStream = new stream.PassThrough()
        studentProfile_bufferStream.end(studentProfile.data)

        studentProfile_bufferStream.pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            
            for (const data in results){

                console.log(data)
                if (results[data].entry_semester !== 'Fall' && results[data].entry_semester !== 'Spring') throw results[data].entry_semester + 'Semester string is not correct'
                if (departments.indexOf(results[data].department) <= -1) throw 'Not a correct department'

                let user = await User.create({
                    firstName: results[data].first_name,
                    lastName: results[data].last_name,
                    email: results[data].email,
                    password: results[data].password,
                    isStudent: true
                });

                await Student.create({
                    sbuID: results[data].sbu_id,
                    department: results[data].department,
                    track: results[data].track,
                    entrySemester: (results[data].entry_semester === 'Fall' ? 'F' + results[data].entry_year.slice(-2) : 'S' + results[data].entry_year.slice(-2)),
                    requirement_version_semester: results[data].requirement_version_semester,
                    requirement_version_year: results[data].requirement_version_year,
                    graduation_semester: results[data].graduation_semester,
                    graduation_year: results[data].graduation_year,
                    UserId: user.id
                    
                });

            }
           
        });

        results = []
        var studentCourse_bufferStream = new stream.PassThrough()
        studentCourse_bufferStream.end(studentCoursePlan.data)

        studentCourse_bufferStream.pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            
            for (const data in results){

                var student = await Student.findOne({where: {sbu_id: results[data].sbu_id}})

                if (!student) throw 'Student not found!'
                
                var courses = await student.getCourses()
                var course = await courses.get(Student_Course, {where: {
                    department: results[data].department, 
                    course_num: results[data].course_num,

                }})

                if(course.length > 0) {
                    //update course
                }else {
                    let newCourse = await Student_Course.create({
                        department: results[data].department, 
                        course_num: results[data].course_num,
                        semester: results[data].semester,
                        year: results[data].year,
                        grade: results[data].grade,
                        section: results[data].section
                    })

                    await courses.add(newCourse)
                }
            }
           
        });



        
        
        res.send("Succesful")
    }catch (error) {
        console.log(error)
        res.status(500).send("error importing student file")
    }
})



module.exports = router;