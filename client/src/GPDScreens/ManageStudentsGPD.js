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
            grades: []
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

    deleteStudentCallback = () => {
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

    checkCompletedRequirements = (student) => {
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
                }
<<<<<<< HEAD
                else if(student.track === "Computational Biology"){
                    let courses = tempDegree.json.requirements.tracks.bio.courses
                    console.log(courses);
                    for(var course in courses){
                        let courseStrArr = courses[course].split("/")
                        for(let i = 0; i < courseStrArr.length; i++){
                            for(var grade in this.state.grades){
                                if(courseStrArr[i] === (this.state.grades[grade].department + " " + this.state.grades[grade].course_num).toString() && this.state.grades[grade].StudentId === student.id)
                                {
                                    if(this.state.grades[grade].grade === "A" || this.state.grades[grade].grade === "B") {
                                        completedCourses = completedCourses + 1;
                                    }
                                    else if(this.state.grades[grade].grade === "C"){
                                        if(this.state.grades[grade].grade.length > 1){
                                            if(this.state.grades[grade].grade.charAt(1) !== "-"){
                                                completedCourses = completedCourses + 1
=======
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
>>>>>>> fcdeee7f1888e9554b8a4cdeeee9b7ce15577202
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
<<<<<<< HEAD
                }
                else if(student.track === "Statistics"){
                    let courses = tempDegree.json.requirements.tracks.stats.courses
                    console.log(courses);
                    for(var course in courses){
                        let courseStrArr = courses[course].split("/")
                        for(let i = 0; i < courseStrArr.length; i++){
                            for(var grade in this.state.grades){
                                if(courseStrArr[i] === (this.state.grades[grade].department + " " + this.state.grades[grade].course_num).toString() && this.state.grades[grade].StudentId === student.id)
                                {
                                    if(this.state.grades[grade].grade === "A" || this.state.grades[grade].grade === "B") {
                                        completedCourses = completedCourses + 1;
                                    }
                                    else if(this.state.grades[grade].grade === "C"){
                                        if(this.state.grades[grade].grade.length > 1){
                                            if(this.state.grades[grade].grade.charAt(1) !== "-"){
                                                completedCourses = completedCourses + 1
=======
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
>>>>>>> fcdeee7f1888e9554b8a4cdeeee9b7ce15577202
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
                }
<<<<<<< HEAD
                else if(student.track === "Quanitative Finance"){
                    let courses = tempDegree.json.requirements.tracks.quan.courses
                    console.log(courses);
                    for(var course in courses){
                        let courseStrArr = courses[course].split("/")
                        for(let i = 0; i < courseStrArr.length; i++){
                            for(var grade in this.state.grades){
                                if(courseStrArr[i] === (this.state.grades[grade].department + " " + this.state.grades[grade].course_num).toString() && this.state.grades[grade].StudentId === student.id)
                                {
                                    if(this.state.grades[grade].grade === "A" || this.state.grades[grade].grade === "B") {
                                        completedCourses = completedCourses + 1;
                                    }
                                    else if(this.state.grades[grade].grade === "C"){
                                        if(this.state.grades[grade].grade.length > 1){
                                            if(this.state.grades[grade].grade.charAt(1) !== "-"){
                                                completedCourses = completedCourses + 1
=======
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
>>>>>>> fcdeee7f1888e9554b8a4cdeeee9b7ce15577202
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
                }  
            }
        }
        let coursesArr = [];
        coursesArr.push(completedCourses);
        coursesArr.push(pendingCourses);
        coursesArr.push(unsatisfiedCourses);
        return coursesArr;
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
                        {this.state.students.map((student) => (
                                <tr  key={student.sbuID} onClick={this.editStudent.bind(this, student)}>
                                    <th data-field="Name">{student.User.firstName + " " + student.User.lastName}</th>
                                    <th data-field="Id">{student.sbuID}</th>
                                    <th data-field="Email">{student.User.email}</th>
                                    <th data-field="Department">{student.department}</th>
                                    <th data-field="Track">{student.track}</th>
                                    <th data-field="Entry Semester">{student.entrySemester}</th>
                                    <th data-field="Completed Courses">{this.checkCompletedRequirements(student)[0]}</th>
                                    <th data-field="Pending Courses">{this.checkCompletedRequirements(student)[1]}</th>
                                    <th data-field="Unsatisfied Courses">{this.checkCompletedRequirements(student)[2]}</th>
                                </tr>
                            ))
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