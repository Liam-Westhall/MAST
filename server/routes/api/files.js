const express = require('express')
const stream = require('stream')
const fs = require('fs')
const csv = require('csv-parser')
const {Op, json} = require("sequelize")
const router = express.Router()
const { PdfReader } = require('pdfreader')


const {Course, Degree, Student, User, Student_Course, Course_Offerings} = require('../../models')
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
        
        let name_check = await Degree.findOne({where: {department: degree_json.name}}).catch((err) => console.log('caught it'));

        if(name_check){
            await Degree.update({
                json: degree_json
               }, {where : {department: degree_json.name}}).catch((err) => console.log('caught it'));
        }
        else{
            await Degree.create({
                department: degree_json.name,
                track: degree_json.version,
                json: degree_json
            }).catch((err) => console.log('caught it'));
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
        const semesters_deleted = []


        var bufferStream = new stream.PassThrough()
        bufferStream.end(file.data)

        bufferStream.pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
           
            for (const data in results){

            
                console.log(data)
                if (results[data].semester !== 'Fall' && results[data].semester !== 'Spring') throw results[data].semester + 'Semester string is not correct'
                if (departments.indexOf(results[data].department) <= -1) throw 'Not a correct department'
                
                var sem = (results[data].semester === 'Fall' ? 'F' + results[data].year.slice(-2) : 'S' + results[data].year.slice(-2))
                if (!semesters_deleted.includes(sem)){
                    await Course.destroy({where: {semester: sem}}).catch((err) => console.log('caught it'));
                    semesters_deleted.push(sem)
                }
            


                await Course.create({
                    department: results[data].department,
                    courseNumber: results[data].course_num,
                    semester: (results[data].semester === 'Fall' ? 'F' + results[data].year.slice(-2) : 'S' + results[data].year.slice(-2)) ,
                    section:parseInt(results[data].section),
                    days: results[data].timeslot,
                    name: '',
                    description: '',
                    credits: 0,
                    totalStudents: 0
                }).catch((err) => console.log('caught it'));

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

        console.log(req.files)
        const studentProfile = req.files.studentProfile
        const studentCoursePlan = req.files.studentCoursePlan
        const results = []
        const course_results = []
        const departments = ['CSE', 'AMS', 'CE', 'BMI']


        var studentProfile_bufferStream = new stream.PassThrough()
        studentProfile_bufferStream.end(studentProfile.data)
        
        studentProfile_bufferStream.pipe(csv())
        .on('data', (data) => {console.log(data) 
            results.push(data)})
        .on('end', async () => {
            
            for (const data in results){

                let check = await User.findOne({where : {email: results[data].email}}).catch((err) => console.log('caught it'));

                if (check) {
                    try {
                    let previousStudentProfile = await Student.findOne({where: {UserId: check.id}})
                    await check.destroy()
                    await previousStudentProfile.destroy()
                    }catch (e) {
                        console.log(e)
                    }
                }

                console.log(data)
                if (results[data].entry_semester !== 'Fall' && results[data].entry_semester !== 'Spring') throw results[data].entry_semester + 'Semester string is not correct'
                if (departments.indexOf(results[data].department) <= -1) throw 'Not a correct department'
            
                let user = await User.create({
                    firstName: results[data].first_name,
                    lastName: results[data].last_name,
                    email: results[data].email,
                    password: results[data].password,
                    isStudent: true
                }).catch((err) => console.log('caught it'));

                
                await Student.create({
                    sbuID: results[data].sbu_id,
                    department: results[data].department,
                    track: results[data].track,
                    entrySemester: (results[data].entry_semester === 'Fall' ? 'F' + results[data].entry_year.slice(-2) : 'S' + results[data].entry_year.slice(-2)),
                    requirement_version_semester: results[data].requirement_version_semester,
                    requirement_version_year: results[data].requirement_version_year,
                    graduation_semester: results[data].graduation_semester,
                    graduation_year: results[data].graduation_year,
                    UserId: user.id,
                    coursePlan: {"studentID": results[data].sbu_id,
                                "semesters": {}
                            }
                    
                }).catch((err) => console.log('caught it'));

                

            }
           
        })

       
        res.send("Succesful")
    }catch (error) {
        console.log(error)
        res.status(500).send("error importing student file")
    }
})



router.post('/student_course_data', async (req, res) => {


    //console.log(req.body.file)
    // console.log(req.files.file)

    try{

        if(!req.files) res.status(500).send({error: "No file"})

        console.log(req.files)
        const studentCoursePlan = req.files.studentCoursePlan
        const course_results = []
        const departments = ['CSE', 'AMS', 'CE', 'BMI']


        console.log("Updating course info...")
        // while(results.length > 0) {
        //     results.pop();
        // }

        var studentCourse_bufferStream = new stream.PassThrough()
        studentCourse_bufferStream.end(studentCoursePlan.data)

        await studentCourse_bufferStream.pipe(csv())
        .on('data', (data) => course_results.push(data))
        .on('end', async () => {
            
            for (const data in course_results){
                console.log(course_results[data])
                var semesterExists = false;

                var student = await Student.findOne({where: {sbuID: course_results[data].sbu_id}})

                var sem = (course_results[data].semester === 'Fall' ? 'F' + course_results[data].year.slice(-2) 
                : 'S' + course_results[data].year.slice(-2))

                if (!student) throw 'Student not found!'

                var coursePlan = student.coursePlan


                semesterExists = coursePlan["semesters"][sem] ?  true : false;

                if(semesterExists){
                    var updated = false;

                    for(var course in coursePlan["semesters"][sem]){

                        if(course.department == course_results[data].department && course.courseNum == course_results[data].course_num){
                            course.semester = course_results[data].semester
                            course.year = course_results[data].year
                            course.grade = course_results[data].grade
                            updated = true;
                        }

                    }

                    if(!updated){
                        var num_of_courses = Object.keys(coursePlan["semesters"][sem]).length

                        coursePlan["semesters"][sem][num_of_courses - 1] = {

                            "department": course_results[data].department,
                            "courseNum": course_results[data].course_num,
                            "credits": -1,
                            "semester": course_results[data].semester,
                            "year": course_results[data].year,
                            "grade": course_results[data].grade

                        }

                    }
                }else {
                    
                    coursePlan["semesters"][sem] = {
                        "0": {
                            "department": course_results[data].department,
                            "courseNum": course_results[data].course_num,
                            "credits": -1,
                            "semester": course_results[data].semester,
                            "year": course_results[data].year,
                            "grade": course_results[data].grade
                        }
                    }

                }


                var student_course= await Student_Course.findOne({where: {
                    StudentId: student.id,
                    department: course_results[data].department,
                    course_num: course_results[data].course_num,
                }})

                if(student_course){
                    console.log("LOG-------------------------> UPDATING student course")
                    await Student_Course.update({
                        department: course_results[data].department,
                        course_num: parseInt(course_results[data].course_num),
                        semester: course_results[data].semester,
                        year: course_results[data].year,
                        grade: course_results[data].grade,
                        section: parseInt(course_results[data].section)
                    }, {where: {
                        StudentId: student.id,
                        department: course_results[data].department,
                        course_num: course_results[data].course_num,
                    }})
                }else {
                    console.log("LOG-------------------------> CREATING student course")
                        let newCourse = await Student_Course.create({
                            StudentId: student.id,
                            department: course_results[data].department, 
                            course_num: parseInt(course_results[data].course_num),
                            semester: course_results[data].semester,
                            year: course_results[data].year,
                            grade: course_results[data].grade,
                            section: course_results[data].section === "" ? 0 : parseInt(course_results[data].section),
                            credits: 0,
                            section: 0
                 })
                }
    


                await Student.update({coursePlan: coursePlan}, {where: {sbuID: course_results[data].sbu_id}})
            }


           
        });



        
        
        res.send("Succesful")
    }catch (error) {
        console.log(error)
        res.status(500).send("error importing student file")
    }
})


router.post('/student_grades', async (req, res) => {
    const {gradesObj} = req.files;
    let grades_json = JSON.parse(gradesObj.data);
    console.log(grades_json)
    try{
        studentID = grades_json.studentID
        let student = await Student.findOne({
            where: {sbuID: studentID}
        }).catch((err) => console.log('caught it'));;
        for(var sem in grades_json.semesters){
            console.log(grades_json.semesters[sem]);
            for(var course in grades_json.semesters[sem]){
                let student_course = await Student_Course.create({
                    StudentId: student.id,
                    department: grades_json.semesters[sem][course].department,
                    course_num: grades_json.semesters[sem][course].courseNum,
                    credits: grades_json.semesters[sem][course].credits,
                    semester: grades_json.semesters[sem][course].semester,
                    year: grades_json.semesters[sem][course].year,
                    grade: grades_json.semesters[sem][course].grade,
                    section: 0
                }).catch((err) => console.log('caught it'));
            }
        }
    }catch (error) {
        console.log(error)
        res.status(500).send("error importing student data")
    }
});


router.post('/course_info', async (req, res) => {
    //console.log(req.files.file.data)

    const {file, semester, dept} = req.body;

    try{
        if(!req.files) res.status(500).send({error: "No file"})

        let rawtext = new Array();

        //Read pdf and convert to array or strings for each line
        new PdfReader().parseBuffer(req.files.file.data, function(err, item) {
            if (err) callback(err);
            else if (!item) {
                //Get Data from pdf for specified department
                var isdept = false;
                let deptData = new Array();

                //Gets text for chosen department
                rawtext.forEach(function(line) {
                    let str = line
                    if (str.length === 3) {
                        if (isdept && !/[^a-z]/i.test(str)) {
                            console.log('that', str)
                            isdept = false;
                        }

                        if (str === dept) {
                            console.log('this', str)
                            deptData.push(str)
                            isdept = true;
                        } 
                    } else if (isdept) {
                        deptData.push(str)
                    }
                });

                //Split Data by course
                let allCrsData = new Array();
                let department = deptData[0];
                let courseData = new Array();

                //Gets text for chosen department
                for (let i = 2; i < deptData.length; i++) {
                    let str = deptData[i];
                    let tempDept = str.substring(0, 3);
                    let tempNum = Number(str.substring(5, 8));

                    if (tempDept === department && tempNum >= 500) {
                        allCrsData.push(courseData);
                        courseData = new Array();
                        courseData.push(str);
                    } else if (str === 'May be repeated for credit.' || str === 'Offered'|| str === 'May be repeated 2 times FOR credit.') {
                    } else if (str === 'Stony Brook University Graduate Bulletin: www.stonybrook.edu/gradbulletin') {
                        i += 3;
                    } else {
                        courseData.push(str);
                    }
                }

                //Split data for each course and add to database
                for (let i = 0; i < allCrsData.length; i++) {
                    let dept = '';
                    let courseNum = '';
                    let title = '';
                    let description = '';
                    let credits = 0;
                    let prereqs = '';
            
                    let titleIsDone = false;
                    let descriptionIsDone = false;
            
                    for (let j = 0; j < allCrsData[i].length; j++) {
                        if (j === 0) {
                            dept = allCrsData[i][j].substring(0, 3);
                            courseNum = allCrsData[i][j].substring(5, 8);
                            title = allCrsData[i][j].substring(9);
                        } else {
            
                            //If title is not done
                            if (!titleIsDone) {
                                let tempWords = allCrsData[i][j].split(" ");
                                let isUpper = true;
                                
                                //Check the line to see if every word begins with an uppercase letter
                                for (let k = 0; k < tempWords.length; k++) {
                                    if (tempWords[k].charCodeAt(0) > 90) {
                                        isUpper = false;
                                    }
                                }
            
                                //if words all start with uppercase, add to title
                                if (isUpper) {
                                    title += allCrsData[i][j];
                                } else {
                                    //if any word starts with lowercase letter
                                    //add to description and set title bool 
                                    description += allCrsData[i][j];
                                    titleIsDone = true;
                                }
            
                                //If description is not done
                            } else if (!descriptionIsDone) {
                                let isPrereq = false;
                                let iscredit = false;
            
                                let tempWords = allCrsData[i][j].split(" ");
                                //console.log(tempWords);
                                //Regex expression that matches line in bulletin with credit info
                                if (tempWords[0].match(/(Fall,)|(Spring,)|(\d credits?)|(Offered)|(\d-\d{1,2})/i)) {
                                    descriptionIsDone = true;
                                    //Find character that is a number, set credits
                                    let tempChars = allCrsData[i][j].split('');
                                    for (let k = 0; k < tempChars.length; k++) {
                                        let num = tempChars[k].charCodeAt(0);
                                        if (num >= 48 && num <= 57) {
                                            //console.log(tempChars[k].charCodeAt(0), tempChars[k]);
                                            credits = parseInt(tempChars[k]);
                                        }
                                    }
                                } else {
                                    //If not the credits(check if prereq?) add to description
                                    description += allCrsData[i][j];
                                }
            
                            } 
            
                        }
            
                    }
                    if (credits === 0) {
                        credits = 3;
                    }
                    if (dept === '' || courseNum  === '' || title  === '' || description  === '' || credits === '') {

                    } else {
                        Course_Offerings.sync().then(function() {
                            Course_Offerings.findOrCreate({
                              where: {
                                department: dept,
                                courseNumber: courseNum
                              },
                              defaults: { 
                                department: dept,
                                courseNumber: courseNum,
                                name: title,
                                description: description,
                                credits: credits
                              }
                            }).then(function(result) {
                              if (!result[1]) { 
                                result[0].update({
                                    name: title,
                                    description: description,
                                    credits: credits
                                }, {
                                    where: {
                                        department: dept,
                                        courseNumber: courseNum
                                    }
                                }); 
                              }
                            });
                          })
                    }
                }




            }   //When EOF is reached, scrub data and add to database
            else if (item.text) {
                rawtext.push(item.text);
            }
        });
       
        res.send("Succesful")
    }catch (error) {
        console.log(error)
        res.status(500).send("error importing course information")
    }
})


module.exports = router;