import React, { Component} from 'react'
import NavbarGPD from './NavbarGPD'
import { Row, Col, TextInput, Button, Table, Modal} from 'react-materialize'
import axios from 'axios'
import { Redirect } from 'react-router-dom'

class ManageStudentsGPD extends Component{
    constructor(props){
        super(props)
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            department: "",
            entrySemester: "",
            track: "",
            students: [],
            comments: [],
            query: "",
            graduation_semester: "",
            graduation_year: "",
            editStudent: false,
            currentEditStudent: null,
            refresh: false,
            searchByFirsName: false,
            searchByLastName: false,
            searchByStudentID: false,
            searchByDepartment: false,
            searchByEmail: false,
            searchByTrack: false,
            searchByStudentID_input: "",
            searchByFirstName_input: "",
            searchByLastName_input: "",
            searchByDepartment_input: "",
            searchByEmail_input: "",
            searchByTrack_input: "",
            degreeData: [],
            grades: [],
            student_grades: []
        }
    }


    calcGPA = (id) => {
        //get grades from databse

        let grades = []

        for(const item of this.state.student_grades){
            if(item.id == id){
                grades = [...item.grades]
                break
            }
        }

        let grades4GPA = [...grades]
        let totalCredits = 0
        let finalGPA = 0
        //loop through and get total credits
        for(let i = 0; i < grades4GPA.length; i++){
            totalCredits += grades4GPA[i].credits
        }
        //loop through grades that are length two A-, b+, c+ etc...
        for(let i = 0; i < grades4GPA.length; i++){
            if(grades4GPA[i].grade.length == 2){
                if(grades4GPA[i].grade.charAt(0) == "A"){
                    if(grades4GPA[i].grade.charAt(1) == "-"){
                        let gradeValue = 3.67
                        let creditValue = grades4GPA[i].credits
                        let GPAValue = gradeValue * creditValue
                        finalGPA += GPAValue
                    }
                }
                if(grades4GPA[i].grade.charAt(0) == "B"){
                    if(grades4GPA[i].grade.charAt(1) == "+"){
                        let gradeValue = 3.33
                        let creditValue = grades4GPA[i].credits
                        let GPAValue = gradeValue * creditValue
                        finalGPA += GPAValue
                    }
                    if(grades4GPA[i].grade.charAt(1) == "-"){
                        let gradeValue = 2.67
                        let creditValue = grades4GPA[i].credits
                        let GPAValue = gradeValue * creditValue
                        finalGPA += GPAValue
                    }
                }
                if(grades4GPA[i].grade.charAt(0) == "C"){
                    if(grades4GPA[i].grade.charAt(1) == "+"){
                        let gradeValue = 2.33
                        let creditValue = grades4GPA[i].credits
                        let GPAValue = gradeValue * creditValue
                        finalGPA += GPAValue
                    }
                    if(grades4GPA[i].grade.charAt(1) == "-"){
                        let gradeValue = 1.67
                        let creditValue = grades4GPA[i].credits
                        let GPAValue = gradeValue * creditValue
                        finalGPA += GPAValue
                    }
                    
                }
                if(grades4GPA[i].grade.charAt(0) == "D"){
                    if(grades4GPA[i].grade.charAt(1) == "+"){
                        let gradeValue = 1.33
                        let creditValue = grades4GPA[i].credits
                        let GPAValue = gradeValue * creditValue
                        finalGPA += GPAValue
                    }
                }
            }
            //Loop through classes get their grade and credit and mulitply for GPA Value
            if(grades4GPA[i].grade.charAt(0) == "A"){
                let gradeValue = 4.0
                let creditValue = grades4GPA[i].credits 
                let GPAValue = gradeValue * creditValue
                finalGPA += GPAValue
            }
            if(grades4GPA[i].grade.charAt(0) == "B"){
                let gradeValue = 3.0
                let creditValue = grades4GPA[i].credits 
                let GPAValue = gradeValue * creditValue
                finalGPA += GPAValue
            }
            if(grades4GPA[i].grade.charAt(0) == "C"){
                let gradeValue = 2.0
                let creditValue = grades4GPA[i].credits 
                let GPAValue = gradeValue * creditValue
                finalGPA += GPAValue
            }
            if(grades4GPA[i].grade.charAt(0) == "D"){
                let gradeValue = 1.0
                let creditValue = grades4GPA[i].credits
                let GPAValue = gradeValue * creditValue
                finalGPA += GPAValue
            }
            if(grades4GPA[i].grade.charAt(0) == "F"){
                let gradeValue = 0.0
                let creditValue = grades4GPA[i].credits
                let GPAValue = gradeValue * creditValue
                finalGPA += GPAValue
            }
            finalGPA = finalGPA / totalCredits //get the actual final GPA

            return finalGPA
        }
    }

    onClickSearchCallback = async () => {

        let values = this.state.query.split(" ")

        if (this.state.query.length === 0) return 

        if(values.length > 2) {
            values = values.filter((item) => item.length > 0)
        }

        if(values.length > 2) return
        

        let path = values.length === 1 ?  "/api/students/search?firstName=" + values[0] : "/api/students/search?firstName=" + values[0] + "&lastName=" + values[1]
        console.log("path is:::", path)
        let res = await axios.get(path).catch((err) => console.log('caught', err));
        
        this.setState({students: res.data})
    }

    onClickAdvanceSearch = async () => {
        
        let path = "/api/students/search?"
        let firstFilter = true

        if (this.state.searchByFirsName) {
            path = path + "firstName=" + this.state.searchByFirstName_input.trim()
            firstFilter = false
        }

        if (this.state.searchByLastName) {
            path =  firstFilter ? (path + "lastName=" + this.state.searchByLastName_input.trim()) : (path + "&lastName=" + this.state.searchByLastName_input.trim())
            firstFilter = false
        }

        if (this.state.searchByDepartment) {
            path =  firstFilter ? (path + "department=" + this.state.searchByDepartment_input.trim()) : (path + "&department=" + this.state.searchByDepartment_input.trim())
            firstFilter = false
        }

        if (this.state.searchByEmail) {
            path =  firstFilter ? (path + "email=" + this.state.searchByEmail_input.trim()) : (path + "&email=" + this.state.searchByEmail_input.trim())
            firstFilter = false
        }

        if (this.state.searchByTrack) {
            path =  firstFilter ? (path + "track=" + this.state.searchByTrack_input.trim()) : (path + "&track=" + this.state.searchByTrack_input.trim())
            firstFilter = false
        }

        if (this.state.searchByStudentID) {
            path =  firstFilter ? (path + "sbuID=" + this.state.searchByStudentID_input.trim()) : (path + "&sbuID=" + this.state.searchByStudentID_input.trim())
            firstFilter = false
        }


        let res = await axios.get(path).catch((err) => console.log('caught', err));
        this.setState({students: res.data})

    }

    getAllGrades = async () => {
        let header = {
            headers: {
              "Content-Type": "application/json",
            },
          }; 
        let res = await axios.post("/api/courses/getallgrades", header).catch((err) => console.log('caught error'));
        this.setState({grades: res.data})
    }

    onChangeSearchQuery = (event) => {

        this.setState({query: event.target.value})

    }

    onChange = (event) => {
        this.setState({[event.target.id]: event.target.value});
    }

    addStudentCallback = async () => {
        let body = {firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email, password: this.state.password, department: this.state.department, entrySemester: this.state.entrySemester, track: this.state.track, graduation_semester: this.state.graduation_semester, graduation_year: this.state.graduation_year};
        let header = {
            headers: {
              "Content-Type": "application/json",
            },
          };    
        await axios.post("/api/add_student/", body, header).catch((error) => console.log(error));
        this.loadStudents()
    }

    deleteStudentCallback = async () => {
        let body = []
        axios.post("/api/students/delete_all", body).catch((error) => console.log(error));
        this.setState({students: []});
    }

    editStudent = async (student) => {
        let body = {id: student.sbuID};
        console.log(body);
        await axios.post('/api/comments', body).then((res) => this.setState({comments: res.data, currentEditStudent: student, editStudent: true})).catch((err) => console.log(err));
        console.log(this.state.comments);
    }

    loadStudents = async () => {
        var students = await axios.get('/api/students').catch((err) => console.log('caught', err));
        console.log(students.data)
        this.setState({students: students.data})
        
        let grades = []
        for (const student of students.data){
            
            let body = {id: student.id};
            let header = {
            headers: {
              "Content-Type": "application/json",
            },
            }; 
            let res = await axios.post("/api/courses/getgrades", body)
            grades.push({id: student.id, grades: [...res.data]})
        }

        this.setState({student_grades: [...grades]})
    }

    async componentDidMount() {
        await this.loadStudents();
        await this.getDegreeRequirements();
        await this.getAllGrades();
    }

    getDegreeRequirements = async () => {
        let degrees = await axios.get('/api/degrees').catch((err) => console.log('caught', err));
        let degreeData = degrees.data
        console.log(degreeData);
        this.setState({degreeData: degreeData})
    }

    checkCourseInPlan = (student, course) => {
        var arrCourses = [];
        let tempCoursePlan = student.coursePlan
        if(tempCoursePlan == null){
            return false;
        }
        else{
            Object.keys(tempCoursePlan).forEach(function (key){
                Object.keys(tempCoursePlan[key]).forEach(function (key2){
                        Object.keys(tempCoursePlan[key][key2]).forEach(function (key3){
                            arrCourses.push(tempCoursePlan[key][key2][key3])
                        }) 
                })
            });
            for(let j = 0; j < arrCourses.length; j++){
                let courseStr = arrCourses[j].department + " " + arrCourses[j].courseNum;
                if(course == courseStr){
                    return true;
                }
            }
            return false;
        }
    }

    checkCompletedRequirements =  (student) => {
        let completedCourses = 0;
        let pendingCourses = 0;
        let unsatisfiedCourses = 0;
        for(let i = 0; i < this.state.degreeData.length; i++){
            let tempDegree = this.state.degreeData[i];
            if(student.department.replace(/ /g,'') === tempDegree.department){
                if(student.department.replace(/ /g,'') === "AMS"){
                    if(student.track === "Computational Applied Mathematics"){
                        let courses = tempDegree.json.requirements.tracks.comp.courses
                        console.log(courses);
                        for(var course in courses){
                            let courseStrArr = courses[course].split("/")
                            for(let i = 0; i < courseStrArr.length; i++){
                                let completedCheck = false;
                                for(var grade in this.state.grades){
                                    if(courseStrArr[i] === (this.state.grades[grade].department + " " + this.state.grades[grade].course_num).toString() && this.state.grades[grade].StudentId === student.id)
                                    {
                                        if(this.state.grades[grade].grade ==="A" || this.state.grades[grade].grade === "B") {
                                            completedCourses = completedCourses + 1;
                                            completedCheck = true;
                                        }
                                        else if(this.state.grades[grade].grade === "C"){
                                            if(this.state.grades[grade].grade.length > 1){
                                                if(this.state.grades[grade].grade.charAt(1) !== "-"){
                                                    completedCourses = completedCourses + 1
                                                    completedCheck = true;
                                                }
                                            }
                                        }
                                    }
                                }
                                if(this.checkCourseInPlan(student, courseStrArr[i]) && !completedCheck){
                                    pendingCourses = pendingCourses + 1;
                                }
                                else if(!completedCheck && i == courseStrArr.length - 1){
                                    unsatisfiedCourses = unsatisfiedCourses + 1;
                                }     
                            }
                        }
                    }
                    else if(student.track == "Operations Research"){
                        let courses = tempDegree.json.requirements.tracks.op.courses
                        console.log(courses);
                        for(var course in courses){
                            console.log(courses[course]);
                            let courseStrArr = courses[course].split("/")
                            for(let i = 0; i < courseStrArr.length; i++){
                                let completedCheck = false;
                                for(var grade in this.state.grades){
                                    if(courseStrArr[i] == (this.state.grades[grade].department + " " + this.state.grades[grade].course_num).toString() && this.state.grades[grade].StudentId == student.id)
                                    {
                                        if(this.state.grades[grade].grade == "A" || this.state.grades[grade].grade == "B") {
                                            completedCourses = completedCourses + 1;
                                            completedCheck = true;
                                            break;
                                        }
                                        else if(this.state.grades[grade].grade == "C"){
                                            if(this.state.grades[grade].grade.length > 1){
                                                if(this.state.grades[grade].grade.charAt(1) != "-"){
                                                    completedCourses = completedCourses + 1
                                                    completedCheck = true;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                                if(this.checkCourseInPlan(student, courseStrArr[i]) && !completedCheck){
                                    pendingCourses = pendingCourses + 1;
                                }
                                else if(!completedCheck && i == courseStrArr.length - 1){
                                    unsatisfiedCourses = unsatisfiedCourses + 1;
                                }     
                            }
                        }
                    }
                    else if(student.track == "Computational Biology"){
                        let courses = tempDegree.json.requirements.tracks.bio.courses
                        console.log(courses);
                        for(var course in courses){
                            let courseStrArr = courses[course].split("/")
                            for(let i = 0; i < courseStrArr.length; i++){
                                let completedCheck = false;
                                for(var grade in this.state.grades){
                                    if(courseStrArr[i] == (this.state.grades[grade].department + " " + this.state.grades[grade].course_num).toString() && this.state.grades[grade].StudentId == student.id)
                                    {
                                        if(this.state.grades[grade].grade == "A" || this.state.grades[grade].grade == "B") {
                                            completedCourses = completedCourses + 1;
                                            completedCheck = true;
                                        }
                                        else if(this.state.grades[grade].grade == "C"){
                                            if(this.state.grades[grade].grade.length > 1){
                                                if(this.state.grades[grade].grade.charAt(1) != "-"){
                                                    completedCourses = completedCourses + 1
                                                    completedCheck = true;
                                                }
                                            }
                                        }
                                    }
                                }
                                if(this.checkCourseInPlan(student, courseStrArr[i]) && !completedCheck){
                                    pendingCourses = pendingCourses + 1;
                                }
                                else if(!completedCheck && i == courseStrArr.length - 1){
                                    unsatisfiedCourses = unsatisfiedCourses + 1;
                                }     
                            }
                        }
                    }
                    else if(student.track == "Statistics"){
                        let courses = tempDegree.json.requirements.tracks.stats.courses
                        console.log(courses);
                        for(var course in courses){
                            let courseStrArr = courses[course].split("/")
                            for(let i = 0; i < courseStrArr.length; i++){
                                    let completedCheck = false;
                                    for(var grade in this.state.grades){
                                        if(courseStrArr[i] == (this.state.grades[grade].department + " " + this.state.grades[grade].course_num).toString() && this.state.grades[grade].StudentId == student.id)
                                        {
                                            if(this.state.grades[grade].grade == "A" || this.state.grades[grade].grade == "B") {
                                                completedCourses = completedCourses + 1;
                                                completedCheck = true;
                                            }
                                            else if(this.state.grades[grade].grade == "C"){
                                                if(this.state.grades[grade].grade.length > 1){
                                                    if(this.state.grades[grade].grade.charAt(1) != "-"){
                                                        completedCourses = completedCourses + 1
                                                        completedCheck = true;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if(this.checkCourseInPlan(student, courseStrArr[i]) && !completedCheck){
                                        pendingCourses = pendingCourses + 1;
                                    }
                                    else if(!completedCheck && i == courseStrArr.length - 1){
                                        unsatisfiedCourses = unsatisfiedCourses + 1;
                                    }     
                                }
                        }
                    }
                    else if(student.track == "Quanitative Finance"){
                        let courses = tempDegree.json.requirements.tracks.quan.courses
                        console.log(courses);
                        for(var course in courses){
                            let courseStrArr = courses[course].split("/")
                            for(let i = 0; i < courseStrArr.length; i++){
                                let completedCheck = false;
                                for(var grade in this.state.grades){
                                    if(courseStrArr[i] == (this.state.grades[grade].department + " " + this.state.grades[grade].course_num).toString() && this.state.grades[grade].StudentId == student.id)
                                    {
                                        if(this.state.grades[grade].grade == "A" || this.state.grades[grade].grade == "B") {
                                            completedCourses = completedCourses + 1;
                                            completedCheck = true;
                                        }
                                        else if(this.state.grades[grade].grade == "C"){
                                            if(this.state.grades[grade].grade.length > 1){
                                                if(this.state.grades[grade].grade.charAt(1) != "-"){
                                                    completedCourses = completedCourses + 1
                                                    completedCheck = true;
                                                }
                                            }
                                        }
                                    }
                                }
                                if(this.checkCourseInPlan(student, courseStrArr[i]) && !completedCheck){
                                    pendingCourses = pendingCourses + 1;
                                }
                                else if(!completedCheck && i == courseStrArr.length - 1){
                                    unsatisfiedCourses = unsatisfiedCourses + 1;
                                }     
                            }
                        }
                    }
                    
                     //GPA===1 requierment
                    let gpa =  this.calcGPA(student.id)
                    if(gpa >= tempDegree.json.requirements.gpa_requirement){
                        completedCourses = completedCourses + 1
                    }else {
                        unsatisfiedCourses = unsatisfiedCourses + 1;
                    }

                }
                else if(student.department.replace(/ /g,'') == "BMI"){
                    if(student.track == "Project/Imaging Informatics"){
                        let courses = tempDegree.json.requirements.tracks.proj_imag.courses
                        console.log(courses);
                        for(var course in courses){
                            let courseStrArr = courses[course].split("/")
                            for(let i = 0; i < courseStrArr.length; i++){
                                let completedCheck = false;
                                for(var grade in this.state.grades){
                                    if(courseStrArr[i] == (this.state.grades[grade].department + " " + this.state.grades[grade].course_num).toString() && this.state.grades[grade].StudentId == student.id)
                                    {
                                        if(this.state.grades[grade].grade == "A" || this.state.grades[grade].grade == "B") {
                                            completedCourses = completedCourses + 1;
                                            completedCheck = true;
                                        }
                                        else if(this.state.grades[grade].grade == "C"){
                                            if(this.state.grades[grade].grade.length > 1){
                                                if(this.state.grades[grade].grade.charAt(1) != "-"){
                                                    completedCourses = completedCourses + 1
                                                    completedCheck = true;
                                                }
                                            }
                                        }
                                    }
                                }
                                if(this.checkCourseInPlan(student, courseStrArr[i]) && !completedCheck){
                                    pendingCourses = pendingCourses + 1;
                                }
                                else if(!completedCheck && i == courseStrArr.length - 1){
                                    unsatisfiedCourses = unsatisfiedCourses + 1;
                                }     
                            }
                        }
                    }
                    else if(student.track == "Project/Clinical Informatics"){
                        let courses = tempDegree.json.requirements.tracks.proj_clinical.courses
                        console.log(courses);
                        for(var course in courses){
                            let courseStrArr = courses[course].split("/")
                            for(let i = 0; i < courseStrArr.length; i++){
                                let completedCheck = false;
                                for(var grade in this.state.grades){
                                    if(courseStrArr[i] == (this.state.grades[grade].department + " " + this.state.grades[grade].course_num).toString() && this.state.grades[grade].StudentId == student.id)
                                    {
                                        if(this.state.grades[grade].grade == "A" || this.state.grades[grade].grade == "B") {
                                            completedCourses = completedCourses + 1;
                                            completedCheck = true;
                                        }
                                        else if(this.state.grades[grade].grade == "C"){
                                            if(this.state.grades[grade].grade.length > 1){
                                                if(this.state.grades[grade].grade.charAt(1) != "-"){
                                                    completedCourses = completedCourses + 1
                                                    completedCheck = true;
                                                }
                                            }
                                        }
                                    }
                                }
                                if(this.checkCourseInPlan(student, courseStrArr[i]) && !completedCheck){
                                    pendingCourses = pendingCourses + 1;
                                }
                                else if(!completedCheck && i == courseStrArr.length - 1){
                                    unsatisfiedCourses = unsatisfiedCourses + 1;
                                }     
                            }
                        }
                    }
                    else if(student.track == "Project/Translational Bio-Informatics"){
                        let courses = tempDegree.json.requirements.tracks.proj_trans.courses
                        console.log(courses);
                        for(var course in courses){
                            let courseStrArr = courses[course].split("/")
                            for(let i = 0; i < courseStrArr.length; i++){
                                let completedCheck = false;
                                for(var grade in this.state.grades){
                                    if(courseStrArr[i] == (this.state.grades[grade].department + " " + this.state.grades[grade].course_num).toString() && this.state.grades[grade].StudentId == student.id)
                                    {
                                        if(this.state.grades[grade].grade == "A" || this.state.grades[grade].grade == "B") {
                                            completedCourses = completedCourses + 1;
                                            completedCheck = true;
                                        }
                                        else if(this.state.grades[grade].grade == "C"){
                                            if(this.state.grades[grade].grade.length > 1){
                                                if(this.state.grades[grade].grade.charAt(1) != "-"){
                                                    completedCourses = completedCourses + 1
                                                    completedCheck = true;
                                                }
                                            }
                                        }
                                    }
                                }
                                if(this.checkCourseInPlan(student, courseStrArr[i]) && !completedCheck){
                                    pendingCourses = pendingCourses + 1;
                                }
                                else if(!completedCheck && i == courseStrArr.length - 1){
                                    unsatisfiedCourses = unsatisfiedCourses + 1;
                                }     
                            }
                        }
                    }
                    else if(student.track == "Thesis/Imaging Informatics"){
                        let courses = tempDegree.json.requirements.tracks.thesis_imag.courses
                        console.log(courses);
                        for(var course in courses){
                            let courseStrArr = courses[course].split("/")
                            for(let i = 0; i < courseStrArr.length; i++){
                                let completedCheck = false;
                                for(var grade in this.state.grades){
                                    if(courseStrArr[i] == (this.state.grades[grade].department + " " + this.state.grades[grade].course_num).toString() && this.state.grades[grade].StudentId == student.id)
                                    {
                                        if(this.state.grades[grade].grade == "A" || this.state.grades[grade].grade == "B") {
                                            completedCourses = completedCourses + 1;
                                            completedCheck = true;
                                        }
                                        else if(this.state.grades[grade].grade == "C"){
                                            if(this.state.grades[grade].grade.length > 1){
                                                if(this.state.grades[grade].grade.charAt(1) != "-"){
                                                    completedCourses = completedCourses + 1
                                                    completedCheck = true;
                                                }
                                            }
                                        }
                                    }
                                }
                                if(this.checkCourseInPlan(student, courseStrArr[i]) && !completedCheck){
                                    pendingCourses = pendingCourses + 1;
                                }
                                else if(!completedCheck && i == courseStrArr.length - 1){
                                    unsatisfiedCourses = unsatisfiedCourses + 1;
                                }     
                            }
                        }
                    }
                    else if(student.track == "Project/Clinical Informatics"){
                        let courses = tempDegree.json.requirements.tracks.thesis_clinical.courses
                        console.log(courses);
                        for(var course in courses){
                            let courseStrArr = courses[course].split("/")
                            for(let i = 0; i < courseStrArr.length; i++){
                                let completedCheck = false;
                                for(var grade in this.state.grades){
                                    if(courseStrArr[i] == (this.state.grades[grade].department + " " + this.state.grades[grade].course_num).toString() && this.state.grades[grade].StudentId == student.id)
                                    {
                                        if(this.state.grades[grade].grade == "A" || this.state.grades[grade].grade == "B") {
                                            completedCourses = completedCourses + 1;
                                            completedCheck = true;
                                        }
                                        else if(this.state.grades[grade].grade == "C"){
                                            if(this.state.grades[grade].grade.length > 1){
                                                if(this.state.grades[grade].grade.charAt(1) != "-"){
                                                    completedCourses = completedCourses + 1
                                                    completedCheck = true;
                                                }
                                            }
                                        }
                                    }
                                }
                                if(this.checkCourseInPlan(student, courseStrArr[i]) && !completedCheck){
                                    pendingCourses = pendingCourses + 1;
                                }
                                else if(!completedCheck && i == courseStrArr.length - 1){
                                    unsatisfiedCourses = unsatisfiedCourses + 1;
                                }     
                            }
                        }
                    }
                    else if(student.track == "Project/Translational Bio-Informatics"){
                        let courses = tempDegree.json.requirements.tracks.thesis_trans.courses
                        console.log(courses);
                        for(var course in courses){
                            let courseStrArr = courses[course].split("/")
                            for(let i = 0; i < courseStrArr.length; i++){
                                let completedCheck = false;
                                for(var grade in this.state.grades){
                                    if(courseStrArr[i] == (this.state.grades[grade].department + " " + this.state.grades[grade].course_num).toString() && this.state.grades[grade].StudentId == student.id)
                                    {
                                        if(this.state.grades[grade].grade == "A" || this.state.grades[grade].grade == "B") {
                                            completedCourses = completedCourses + 1;
                                            completedCheck = true;
                                        }
                                        else if(this.state.grades[grade].grade == "C"){
                                            if(this.state.grades[grade].grade.length > 1){
                                                if(this.state.grades[grade].grade.charAt(1) != "-"){
                                                    completedCourses = completedCourses + 1
                                                    completedCheck = true;
                                                }
                                            }
                                        }
                                    }
                                }
                                if(this.checkCourseInPlan(student, courseStrArr[i]) && !completedCheck){
                                    pendingCourses = pendingCourses + 1;
                                }
                                else if(!completedCheck && i == courseStrArr.length - 1){
                                    unsatisfiedCourses = unsatisfiedCourses + 1;
                                }     
                            }
                        }
                    }

                     //GPA===1 requierment
                     let gpa = this.calcGPA(student.id)
                     if(gpa >= tempDegree.json.requirements.gpa_requirement){
                         completedCourses = completedCourses + 1
                     }else {
                         unsatisfiedCourses = unsatisfiedCourses + 1;
                     }
                }
                else if(student.department.replace(/ /g,'') == "CE"){
                    if(student.track == "No Thesis"){
                        let courses = tempDegree.json.requirements.tracks.no_thesis.courses
                        console.log(courses);
                        for(var course in courses){
                            let courseStrArr = courses[course].split("/")
                            for(let i = 0; i < courseStrArr.length; i++){
                                let completedCheck = false;
                                for(var grade in this.state.grades){
                                    if(courseStrArr[i] == (this.state.grades[grade].department + " " + this.state.grades[grade].course_num).toString() && this.state.grades[grade].StudentId == student.id)
                                    {
                                        if(this.state.grades[grade].grade == "A" || this.state.grades[grade].grade == "B") {
                                            completedCourses = completedCourses + 1;
                                            completedCheck = true;
                                        }
                                        else if(this.state.grades[grade].grade == "C"){
                                            if(this.state.grades[grade].grade.length > 1){
                                                if(this.state.grades[grade].grade.charAt(1) != "-"){
                                                    completedCourses = completedCourses + 1
                                                    completedCheck = true;
                                                }
                                            }
                                        }
                                    }
                                }
                                if(this.checkCourseInPlan(student, courseStrArr[i]) && !completedCheck){
                                    pendingCourses = pendingCourses + 1;
                                }
                                else if(!completedCheck && i == courseStrArr.length - 1){
                                    unsatisfiedCourses = unsatisfiedCourses + 1;
                                }     
                            }
                        }
                    }
                    else if(student.track == "Thesis"){
                        let courses = tempDegree.json.requirements.tracks.thesis.courses
                        console.log(courses);
                        for(var course in courses){
                            console.log(courses[course]);
                            let courseStrArr = courses[course].split("/")
                            for(let i = 0; i < courseStrArr.length; i++){
                                let completedCheck = false;
                                for(var grade in this.state.grades){
                                    if(courseStrArr[i] == (this.state.grades[grade].department + " " + this.state.grades[grade].course_num).toString() && this.state.grades[grade].StudentId == student.id)
                                    {
                                        if(this.state.grades[grade].grade == "A" || this.state.grades[grade].grade == "B") {
                                            completedCourses = completedCourses + 1;
                                            completedCheck = true;
                                            break;
                                        }
                                        else if(this.state.grades[grade].grade == "C"){
                                            if(this.state.grades[grade].grade.length > 1){
                                                if(this.state.grades[grade].grade.charAt(1) != "-"){
                                                    completedCourses = completedCourses + 1
                                                    completedCheck = true;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                                if(this.checkCourseInPlan(student, courseStrArr[i]) && !completedCheck){
                                    pendingCourses = pendingCourses + 1;
                                }
                                else if(!completedCheck && i == courseStrArr.length - 1){
                                    unsatisfiedCourses = unsatisfiedCourses + 1;
                                }     
                            }
                        }
                    } 

                     //GPA===1 requierment
                     let gpa = this.calcGPA(student.id)
                     if(gpa >= tempDegree.json.requirements.gpa_requirement){
                         completedCourses = completedCourses + 1
                     }else {
                         unsatisfiedCourses = unsatisfiedCourses + 1;
                     }
                }
                else if(student.department.replace(/ /g,'') == "CSE"){
                    if(student.track == "Basic"){
                        let courses = tempDegree.json.requirements.tracks.basic.courses
                        console.log(courses);
                        for(var course in courses){
                            let courseStrArr = courses[course].split("/")
                            for(let i = 0; i < courseStrArr.length; i++){
                                let completedCheck = false;
                                for(var grade in this.state.grades){
                                    if(courseStrArr[i] == (this.state.grades[grade].department + " " + this.state.grades[grade].course_num).toString() && this.state.grades[grade].StudentId == student.id)
                                    {
                                        if(this.state.grades[grade].grade == "A" || this.state.grades[grade].grade == "B") {
                                            completedCourses = completedCourses + 1;
                                            completedCheck = true;
                                        }
                                        else if(this.state.grades[grade].grade == "C"){
                                            if(this.state.grades[grade].grade.length > 1){
                                                if(this.state.grades[grade].grade.charAt(1) != "-"){
                                                    completedCourses = completedCourses + 1
                                                    completedCheck = true;
                                                }
                                            }
                                        }
                                    }
                                }
                                if(this.checkCourseInPlan(student, courseStrArr[i]) && !completedCheck){
                                    pendingCourses = pendingCourses + 1;
                                }
                                else if(!completedCheck && i == courseStrArr.length - 1){
                                    unsatisfiedCourses = unsatisfiedCourses + 1;
                                }     
                            }
                        }
                    }
                    else if(student.track == "Thesis"){
                        let courses = tempDegree.json.requirements.tracks.thesis.courses
                        console.log(courses);
                        for(var course in courses){
                            console.log(courses[course]);
                            let courseStrArr = courses[course].split("/")
                            for(let i = 0; i < courseStrArr.length; i++){
                                let completedCheck = false;
                                for(var grade in this.state.grades){
                                    if(courseStrArr[i] == (this.state.grades[grade].department + " " + this.state.grades[grade].course_num).toString() && this.state.grades[grade].StudentId == student.id)
                                    {
                                        if(this.state.grades[grade].grade == "A" || this.state.grades[grade].grade == "B") {
                                            completedCourses = completedCourses + 1;
                                            completedCheck = true;
                                            break;
                                        }
                                        else if(this.state.grades[grade].grade == "C"){
                                            if(this.state.grades[grade].grade.length > 1){
                                                if(this.state.grades[grade].grade.charAt(1) != "-"){
                                                    completedCourses = completedCourses + 1
                                                    completedCheck = true;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                                if(this.checkCourseInPlan(student, courseStrArr[i]) && !completedCheck){
                                    pendingCourses = pendingCourses + 1;
                                }
                                else if(!completedCheck && i == courseStrArr.length - 1){
                                    unsatisfiedCourses = unsatisfiedCourses + 1;
                                }     
                            }
                        }
                    }
                    else if(student.track == "Advanced"){
                        let courses = tempDegree.json.requirements.tracks.advanced.courses
                        console.log(courses);
                        for(var course in courses){
                            console.log(courses[course]);
                            let courseStrArr = courses[course].split("/")
                            for(let i = 0; i < courseStrArr.length; i++){
                                let completedCheck = false;
                                for(var grade in this.state.grades){
                                    if(courseStrArr[i] == (this.state.grades[grade].department + " " + this.state.grades[grade].course_num).toString() && this.state.grades[grade].StudentId == student.id)
                                    {
                                        if(this.state.grades[grade].grade == "A" || this.state.grades[grade].grade == "B") {
                                            completedCourses = completedCourses + 1;
                                            completedCheck = true;
                                            break;
                                        }
                                        else if(this.state.grades[grade].grade == "C"){
                                            if(this.state.grades[grade].grade.length > 1){
                                                if(this.state.grades[grade].grade.charAt(1) != "-"){
                                                    completedCourses = completedCourses + 1
                                                    completedCheck = true;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                                if(this.checkCourseInPlan(student, courseStrArr[i]) && !completedCheck){
                                    pendingCourses = pendingCourses + 1;
                                }
                                else if(!completedCheck && i == courseStrArr.length - 1){
                                    unsatisfiedCourses = unsatisfiedCourses + 1;
                                }     
                            }
                        }
                    } 

                    //  //GPA===1 requierment
                    //  let gpa = this.calcGPA(student.sbuID)
                    //  if(gpa >= tempDegree.json.requirements.gpa_requirement){
                    //      completedCourses = completedCourses + 1
                    //  }else {
                    //      unsatisfiedCourses = unsatisfiedCourses + 1;
                    //  }
                }  
            }
        }

         return {completedCourses: completedCourses,
                 pendingCourses: pendingCourses,
                 unsatisfiedCourses: unsatisfiedCourses};
    }
    
    populateRequierement =  (student) => {

        var status = this.checkCompletedRequirements(student)
        
        console.log(status)

        return (<tr  key={student.sbuID} onClick={this.editStudent.bind(this, student)}>
        <th data-field="Name">{student.User.firstName + " " + student.User.lastName}</th>
        <th data-field="Id">{student.sbuID}</th>
        <th data-field="Email">{student.User.email}</th>
        <th data-field="Department">{student.department}</th>
        <th data-field="Track">{student.track}</th>
        <th data-field="Entry Semester">{student.entrySemester}</th>
        <th data-field="Completed Courses">{status.completedCourses}</th>
        <th data-field="Pending Courses">{status.pendingCourses}</th>
        <th data-field="Unsatisfied Courses">{status.unsatisfiedCourses}</th>
        </tr>)
    }

    render(){
        return(
            this.state.editStudent ? <Redirect to={{pathname: "edit_student_gpd", state: {currentEditStudent: this.state.currentEditStudent, comments: this.state.comments}}}></Redirect> : 
            <div>
                <NavbarGPD />
                <div className="body">
                <Row>
                    <Col
                    offset="l10"
                    l={3}>
                        <TextInput onChange={this.onChangeSearchQuery}
                        icon="search"
                        label="Search">
                        </TextInput>
                    </Col>
                </Row>
                <Row>
                <Col offset="l10"
                    l={2}
                    >
                        <Button label="Search" onClick={this.onClickSearchCallback}>Search</Button>
                    </Col>
                </Row>
                <Row>
                    <Col
                    offset="l10"
                    l={2}>
                        <Modal
                        actions={[<Button flat modal="close" node="button">Close</Button>]}
                        header="Advance Search"
                        trigger={<Button node="button" waves="light"> Advanced Search </Button>}>
                            <br></br>
                            <label>
                                <input type="checkbox" className="filled-in" checked={this.state.searchByFirsName} onChange={() => this.setState({searchByFirsName: !this.state.searchByFirsName})}/>
                                <span>First-name</span>
                            </label>
                            <TextInput className="white" id="search_firstName_input" onChange={(e) => this.setState({searchByFirstName_input: e.target.value})}></TextInput>

                            <label>
                                <input type="checkbox" className="filled-in" checked={this.state.searchByLastName} onChange={() => this.setState({searchByLastName: !this.state.searchByLastName})}/>
                                <span>Last name</span>
                            </label>
                            <TextInput className="white" id="search_lastName_input" onChange={(e) => this.setState({searchByLastName_input: e.target.value})}></TextInput>

                            <label>
                                <input type="checkbox" className="filled-in" checked={this.state.searchByStudentID} onChange={() => this.setState({searchByStudentID: !this.state.searchByStudentID})}/>
                                <span>Student ID</span>
                            </label>
                            <TextInput className="white" id="search_studentID_input" onChange={(e) => this.setState({searchByStudentID_input: e.target.value})}></TextInput>


                            <label>
                                <input type="checkbox" className="filled-in" checked={this.state.searchByDepartment} onChange={() => this.setState({searchByDepartment: !this.state.searchByDepartment})}/>
                                <span>Department</span>
                            </label>
                            <TextInput className="white" id="search_department_input" onChange={(e) => this.setState({searchByDepartment_input: e.target.value})} ></TextInput>

                            <label>
                                <input type="checkbox" className="filled-in" checked={this.state.searchByEmail} onChange={() => this.setState({searchByEmail: !this.state.searchByEmail})}/>
                                <span>Email</span>
                            </label>
                            <TextInput className="white" id="search_email_input" onChange={(e) => this.setState({searchByEmail_input: e.target.value})}></TextInput>

                            <label>
                                <input type="checkbox" className="filled-in" checked={this.state.searchByTrack} onChange={() => this.setState({searchByTrack: !this.state.searchByTrack})}/>
                                <span>Track</span>
                            </label>
                            <TextInput className="white" id="search_track_input" onChange={(e) => this.setState({searchByTrack_input: e.target.value})}></TextInput>

                            <Button type="search" modal="close" onClick={this.onClickAdvanceSearch}>Submit</Button>
                        </Modal>
                        
                    </Col>
                </Row>
                <Table>
                    <thead>
                        <tr>
                            <th data-field="Name">Name</th>
                            <th data-field="Id">ID</th>
                            <th data-field="Email">Email</th>
                            <th data-field="Department">Department</th>
                            <th data-field="Track">Track</th>
                            <th data-field="Entry Semester">Entry Semester</th>
                            <th data-field="Completed Courses">Completed Courses</th>
                            <th data-field="Pending Courses">Pending Courses</th>
                            <th data-field="Unsatisfied Courses">Unsatisfied Courses</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.students.map((student) => this.populateRequierement(student))
                        }
                    </tbody>
                </Table>
                <br></br>
                <Row>
                    <Col
                    offset="l9"
                    size={1}>
                        <Modal
                        actions={[<Button flat modal="close" node="button">Close</Button>]}
                        header="Add Student"
                        trigger={<Button>Add Student</Button>}>
                            <br></br>
                            <span>First Name:</span>
                            <TextInput className="white" id="firstName" onChange={this.onChange}></TextInput>
                            <span>Last Name:</span>
                            <TextInput className="white" id="lastName" onChange={this.onChange}></TextInput>
                            <span>Email:</span>
                            <TextInput className="white" id="email" onChange={this.onChange}></TextInput>
                            <span>Password:</span>
                            <TextInput className="white" id="password" onChange={this.onChange}></TextInput>
                            <span>Department:</span>
                            <TextInput className="white" id="department" onChange={this.onChange}></TextInput>
                            <span>Entry Semester:</span>
                            <TextInput className="white" id="entrySemester" onChange={this.onChange}></TextInput>
                            <span>Track:</span>
                            <TextInput className="white" id="track" onChange={this.onChange}></TextInput>
                            <span>Graduation Semester:</span>
                            <TextInput className="white" id="graduation_semester" onChange={this.onChange}></TextInput>
                            <span>Graduation Year:</span>
                            <TextInput className="white" id="graduation_year" onChange={this.onChange}></TextInput>
                            <Button type="submit" modal="close" onClick={this.addStudentCallback}>Submit</Button>
                        </Modal>
                    </Col>
                    <Col
                    size={1}>
                        <Button onClick={this.deleteStudentCallback}>Delete All</Button>
                    </Col>
                </Row>
                </div>
            </div>
            
        );
    }
}

export default ManageStudentsGPD