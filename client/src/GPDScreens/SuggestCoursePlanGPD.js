import React, { Component} from 'react'
import { Button, Row, Col, Table, Checkbox, Card, TimePicker } from 'react-materialize';
import NavbarGPD from './NavbarGPD'
import Select from 'react-select'
import axios from 'axios'

class SuggestCoursePlanGPD extends Component {
    constructor(props){
        super(props)
        this.state = {
            currentStudent: this.props.location.state.currentEditStudent,
            studentID: this.props.location.state.currentEditStudent.id,
            major: this.props.location.state.currentEditStudent.department,
            entrySemester: this.props.location.state.currentEditStudent.entrySemester,
            track: this.props.location.state.currentEditStudent.track,
            sbuID: this.props.location.state.currentEditStudent.sbuID,
            expectedGraduation: "",
            grades: [],
            degreeData: [],
            allCourses: [],
            maxCredits: 15,
            remainingSemesters: 4,
            mondayTimeBegin: "00:00",
            mondayTimeEnd: "23:59",
            tuesdayTimeBegin: "00:00",
            tuesdayTimeEnd: "23:59",
            wednesdayTimeBegin: "00:00",
            wednesdayTimeEnd: "23:59",
            thursdayTimeBegin: "00:00",
            thursdayTimeEnd: "23:59",
            fridayTimeBegin: "00:00",
            fridayTimeEnd: "23:59", 
            currentSemester: "S19",
            preferredCourses: [],
            avoidedCourses: [],
            allCourseVals: [],
            currentCoursePlan: [],
        };
    }

    //gets all of the grades in the database for the current student
    getGrades = async () => {
        let body = {id: this.state.studentID};
        let header = {
            headers: {
              "Content-Type": "application/json",
            },
          }; 
        let res = await axios.post("/api/courses/getgrades", body, header).catch((err) => console.log(err));
        this.setState({grades: res.data});
    }
/*
    calcGPA = async () => {
        //get grades from databse
        let grades4GPA = this.getGrades
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
*/
    //gets all the degree requirements for a specific major/track
    getDegreeRequirements = async () => {
        let degrees = await axios.get('api/degrees').catch((err) => console.log('caught it'));
        let degreeData = degrees.data
        for(let i = 0; i < degreeData.length; i++){
            let tempDegree = degreeData[i];
            if(this.state.major.replace(/ /g,'') == tempDegree.department){
                this.setState({
                    degreeData: degreeData[i].json,
                    rerender: true
                });
                break;
            }
        }
    }
//get_creditsd_reamining takes remaining courses paramter and gets the total credits of the courses and see how many credits they still need to take

    //compares grades with required courses for major and track to check what courses still need to be taken
    searchCoursesAMS = async (grades, required_courses, elective_credits) => {
        let finished_courses = []
        let temp_elective_credits = elective_credits
        console.log(temp_elective_credits);
        for(let i = 0; i < grades.length; i++){
            //checks letter grades to see if it is a valid grade (C to pass)
            if(grades[i].grade.charAt(0) <= "C"){
                if(grades[i].grade.length > 1){
                    if(grades[i].grade.charAt(1) != "-"){
                        //then split the required courses by / if there are multiple required courses that could fit one requirement
                        for(let j = 0; j < required_courses.length; j++){
                            let temp_courses = required_courses[j].split('/');
                            let found_course = false;
                            for(let k = 0; k < temp_courses.length; k++){
                                //checks to see if there is a grade that matches a required course
                                if((grades[i].department + " " + grades[i].course_num) == temp_courses[k]){
                                    //if so that course is finished, push to finished courses and remove it from required courses
                                    finished_courses.push(grades[i].department + " " + grades[i].course_num);
                                    required_courses.splice(j, 1);
                                    found_course = true;
                                    break;
                                }
                            }
                            //if no direct course that requirements are solved, check to see if it can satisfy an elective course
                            if(!found_course){
                                let duplicate = false;
                                for(let l = 0; l < finished_courses.length; l++){
                                    //if the grade is already accounted for, don't account for it again
                                    if((grades[i].department + " " + grades[i].course_num) == finished_courses[l]){
                                        duplicate = true;
                                        break;
                                    }
                                }
                                //if not, have it satisfy elective credits
                                if(!duplicate){
                                    finished_courses.push(grades[i].department + " " + grades[i].course_num);
                                    temp_elective_credits = temp_elective_credits - (grades[i].credits);
                                }
                            }
                        }
                    }
                }
                else{
                    for(let j = 0; j < required_courses.length; j++){
                        let temp_courses = required_courses[j].split('/');
                        let found_course = false;
                        for(let k = 0; k < temp_courses.length; k++){
                            //checks to see if there is a grade that matches a required course
                            if((grades[i].department + " " + grades[i].course_num) == temp_courses[k]){
                                //if so that course is finished, push to finished courses and remove it from required courses
                                finished_courses.push(grades[i].department + " " + grades[i].course_num);
                                required_courses.splice(j, 1);
                                found_course = true;
                                break;
                            }
                        }
                        //if no direct course that requirements are solved, check to see if it can satisfy an elective course
                        if(!found_course){
                            let duplicate = false;
                            for(let l = 0; l < finished_courses.length; l++){
                                //if the grade is already accounted for, don't account for it again
                                if((grades[i].department + " " + grades[i].course_num) == finished_courses[l]){
                                    duplicate = true;
                                    break;
                                }
                            }
                            //if not, have it satisfy elective credits
                            if(!duplicate){
                                finished_courses.push(grades[i].department + " " + grades[i].course_num);
                                temp_elective_credits = temp_elective_credits - (grades[i].credits);
                            }
                        }
                    }
                }
            }
        }
        let body = {required_courses: required_courses, elective_credits: temp_elective_credits}
        return body;
    }

    //gets the remaining courses 
    getRemainingCourses = async () => {
        let grades = this.state.grades;
        let required_courses = []
        let elective_credits = 0
        let remaining_courses = []
        if (this.state.major.replace(/ /g,'') == "AMS") {
            if(this.state.track == "Computational Applied Mathematics"){
                required_courses = this.state.degreeData.requirements.tracks.comp.courses
                elective_credits = this.state.degreeData.requirements.tracks.comp.elective_creds
                remaining_courses = await this.searchCoursesAMS(grades, required_courses, elective_credits);
            }
            else if(this.state.track == "Computational Biology"){
                required_courses = this.state.degreeData.requirements.tracks.bio.courses
                elective_credits = this.state.degreeData.requirements.tracks.bio.elective_creds
                remaining_courses = await this.searchCoursesAMS(grades, required_courses, elective_credits);
            }
            else if(this.state.track == "Operations Research"){
                required_courses = this.state.degreeData.requirements.tracks.op.courses
                elective_credits = this.state.degreeData.requirements.tracks.op.elective_creds
                remaining_courses = await this.searchCoursesAMS(grades, required_courses, elective_credits);
            }
            else if(this.state.track == "Statistics"){
                required_courses = this.state.degreeData.requirements.tracks.stats.courses
                elective_credits = this.state.degreeData.requirements.tracks.stats.elective_creds
                remaining_courses = await this.searchCoursesAMS(grades, required_courses, elective_credits);
            }
            else if(this.state.track == "Quanitative Finance"){
                required_courses = this.state.degreeData.requirements.tracks.quan.courses
                elective_credits = this.state.degreeData.requirements.tracks.quan.elective_creds
                remaining_courses = await this.searchCoursesAMS(grades, required_courses, elective_credits);
            }
        } 
        if(this.state.major.replace(/ /g, '') == 'BMI'){
            if(this.state.track == "Project/Imaging Informatics"){
                required_courses = this.state.degreeData.requirements.tracks.proj_imag.courses
                elective_credits = this.state.degreeData.requirements.tracks.proj_imag.elective_creds
                remaining_courses = await this.searchCoursesAMS(grades, required_courses, elective_credits);
            }
            else if(this.state.track == "Project/Clinical Informatics"){
                required_courses = this.state.degreeData.requirements.tracks.proj_clinical.courses
                elective_credits = this.state.degreeData.requirements.tracks.proj_clinical.elective_creds
                remaining_courses = await this.searchCoursesAMS(grades, required_courses, elective_credits);
            }
            else if(this.state.track == "Project/Translational Bio-Informatics"){
                required_courses = this.state.degreeData.requirements.tracks.proj_trans.courses
                elective_credits = this.state.degreeData.requirements.tracks.proj_trans.elective_creds
                remaining_courses = await this.searchCoursesAMS(grades, required_courses, elective_credits);
            }
            else if(this.state.track == "Thesis/Clinical Informatics"){
                required_courses = this.state.degreeData.requirements.tracks.thesis_clinical.courses
                elective_credits = this.state.degreeData.requirements.tracks.thesis_clinical.elective_creds
                remaining_courses = await this.searchCoursesAMS(grades, required_courses, elective_credits);
            }
            else if(this.state.track == "Thesis/Translational Bio-Informatics"){
                required_courses = this.state.degreeData.requirements.tracks.thesis_trans.courses
                elective_credits = this.state.degreeData.requirements.tracks.thesis_trans.elective_creds
                remaining_courses = await this.searchCoursesAMS(grades, required_courses, elective_credits);
            }
            else if(this.state.track == "Thesis/Imaging Informatics"){
                required_courses = this.state.degreeData.requirements.tracks.thesis_imag.courses
                elective_credits = this.state.degreeData.requirements.tracks.thesis_imag.elective_creds
                remaining_courses = await this.searchCoursesAMS(grades, required_courses, elective_credits);
            }
        }
        if(this.state.major.replace(/ /g, '') == 'CSE'){
            if(this.state.track == "Basic"){
                required_courses = this.state.degreeData.requirements.tracks.basic.courses
                elective_credits = this.state.degreeData.requirements.tracks.basic.elective_creds
                console.log(elective_credits);
                remaining_courses = await this.searchCoursesAMS(grades, required_courses, elective_credits);
                console.log(remaining_courses);
            }
            else if(this.state.track == "Advanced"){
                required_courses = this.state.degreeData.requirements.tracks.advanced.courses
                elective_credits = this.state.degreeData.requirements.tracks.advanced.elective_creds
                remaining_courses = await this.searchCoursesAMS(grades, required_courses, elective_credits);
            }
            else if(this.state.track == "Thesis"){
                required_courses = this.state.degreeData.requirements.tracks.thesis.courses
                elective_credits = this.state.degreeData.requirements.tracks.thesis.elective_creds
                remaining_courses = await this.searchCoursesAMS(grades, required_courses, elective_credits);
            }
        }
        if(this.state.major.replace(/ /g, '') == 'CE'){
            if(this.state.track == "Non-Thesis"){
                required_courses = this.state.degreeData.requirements.tracks.non_thesis.courses
                elective_credits = this.state.degreeData.requirements.tracks.non_thesis.elective_creds
                remaining_courses = await this.searchCoursesAMS(grades, required_courses, elective_credits);
            }
            else if(this.state.track == "Thesis"){
                required_courses = this.state.degreeData.requirements.tracks.thesis.courses
                elective_credits = this.state.degreeData.requirements.tracks.thesis.elective_creds
                remaining_courses = await this.searchCoursesAMS(grades, required_courses, elective_credits);
            }
        }
        return remaining_courses;
    }

    //gets the total credits from the remaining courses for the student to take
    getCreditsRemainingCourses = async (remainingCourses) => {
        
        console.log(remainingCourses);
        let total = 0
        for(const course of remainingCourses){
            let values = course.split(" ")
            let retval = await axios.get("/api/courses/course?name=" + values[0] + "&number=" +values[1])
            if(retval.data != ""){
                total = total + retval.data.credits
            }
        }
        return total
    }

    //triggered when "Suggest Course Plan" Button is pressed
    onClickSuggestPlan = async () => {
        let requirementsBody = await this.getRemainingCourses();
        let remainingCourses = requirementsBody.required_courses;
        let remainingElectiveCredits = requirementsBody.elective_credits;
        let preferredCourses = await this.getPreferredCourses();
        let avoidedCourses = await this.getAvoidedCourses();
        let totalRemainingCredits = await this.getCreditsRemainingCourses(remainingCourses) + remainingElectiveCredits;
        let plans = await this.suggestCoursePlan(remainingCourses, remainingElectiveCredits, preferredCourses, avoidedCourses, totalRemainingCredits);
        this.setState({currentCoursePlan: plans});
        console.log(this.state.currentCoursePlan);
    }

    //gets the preferred courses from the user input on the website
    getPreferredCourses = async () => {
        let courses = []
        for(const course of this.state.preferredCourses){
            let values = course.split(" ")
            let retval = await axios.get("/api/courses/course?name=" + values[0] + "&number=" +values[1])
            
            if(retval.data != ""){
                courses.push(retval.data)
            }
        }

        
        return courses
    }

    //gets the avoided courses from the user input on the website
    getAvoidedCourses = async () => {

        let courses = []
        for(const course of this.state.avoidedCourses){
            let values = course.split(" ")
            let retval = await axios.get("/api/courses/course?name=" + values[0] + "&number=" +values[1])

            if(retval.data != ""){
                courses.push(retval.data)
            }
        }
        console.log(courses);
        return courses

    }

    //gets all courses from the database
    getAllCourses = async () => {
        let courses = await axios.get("/api/courses/").catch((err) => console.log('caught', err));
        let courseData = courses.data
        let courseNames = []
        let courseVals = []
        for(var course in courseData){
            courseVals.push(courseData[course]);
            courseNames.push((courseData[course].department + " " + (courseData[course].courseNumber).toString()));
        }
        courseNames.sort();
        this.setState({
            allCourses: courseNames,
            allCourseVals: courseVals
        });
    }

    convert24to12 = (str) => {
        let [hours, minutes] = str.split(":");
        let time = ""
        if(hours === "12"){
            hours = "00";
        }
        else if(hours.length == 1){
            hours = "0" + hours;
        }
        if(minutes.substring(2) == "PM"){
            hours = parseInt(hours) + 12;
            time = hours + ":" + minutes.substring(0, 2);
        }
        else{
            time = hours + ":" + minutes.substring(0, 2);
        }
        return time;

    }

    smartSuggestCoursePlan = async () => {
        let requirementsBody = await this.getRemainingCourses();
        let remainingCourses = requirementsBody.required_courses;
        let remainingElectiveCredits = requirementsBody.elective_credits;
        let totalRemainingCredits = await this.getCreditsRemainingCourses(remainingCourses) + remainingElectiveCredits;
        let plans = await this.suggestCoursePlan(remainingCourses, remainingElectiveCredits, [], [], totalRemainingCredits);
        console.log(plans);
        this.setState({currentCoursePlan: plans});
    }

    suggestCoursePlan = async (remainingCourses, remainingElectiveCredits, preferredCourses, avoidedCourses, totalRemainingCredits) => {
        let editElectiveCredits = remainingElectiveCredits;
        let remainingSemesters = this.state.remainingSemesters
        let loopNextSem = this.state.currentSemester;
        let coursePlan = []
        let coursePlanWeight = 0
        if(totalRemainingCredits > (this.state.maxCredits * remainingSemesters)){
            return [] //can't be done with constraints provided
        }
        while(remainingSemesters > 0){
            let semCourses = [];
            let loopSemCredits = this.state.maxCredits;
            if(loopNextSem.charAt(0) == "F"){
                loopNextSem = "S" + loopNextSem.substring(1);
            }
            else{
                let year = parseInt(loopNextSem.substring(1));
                year = year + 1
                loopNextSem = "F" + year.toString();
            }
            console.log(loopNextSem);
            //start priority course loop
            for(let i = 0; i < preferredCourses.length; i++){
                let constraintViolated = false;
                let electiveCourse = false;
                //checks to see if any time constraints are violated, if so don't add course to plan
                let initSplit = preferredCourses[i].days.split(" ");
                let daysSplit = initSplit[0].split("/");
                let timesSplit = initSplit[1].split("-");
                for(let temp = 0; temp < daysSplit.length; temp++){
                    if(daysSplit[temp] == "MW"){
                        if((this.convert24to12(timesSplit[0]) < this.state.mondayTimeBegin || this.convert24to12(timesSplit[1]) > this.state.mondayTimeEnd) || (this.convert24to12(timesSplit[0]) < this.state.wednesdayTimeBegin || this.convert24to12(timesSplit[1]) > this.state.wednesdayTimeEnd)){
                            constraintViolated = true;
                            break;
                        }
                    }
                    else if(daysSplit[temp] == "TUTH"){
                        if((this.convert24to12(timesSplit[0]) < this.state.tuesdayTimeBegin || this.convert24to12(timesSplit[1]) > this.state.tuesdayTimeEnd) || (this.convert24to12(timesSplit[0]) < this.state.thursdayTimeBegin || this.convert24to12(timesSplit[1]) > this.state.thursdayTimeEnd)){
                            constraintViolated = true;
                            break;
                        }
                    }
                    else if(daysSplit[temp] == "MWF"){
                        if((this.convert24to12(timesSplit[0]) < this.state.mondayTimeBegin || this.convert24to12(timesSplit[1]) > this.state.mondayTimeEnd) || (this.convert24to12(timesSplit[0]) < this.state.wednesdayTimeBegin || this.convert24to12(timesSplit[1]) > this.state.wednesdayTimeEnd)  && (this.convert24to12(timesSplit[0]) < this.state.fridayTimeBegin || this.convert24to12(timesSplit[1]) > this.state.fridayTimeEnd)){
                            constraintViolated = true;
                            break;
                        }
                    }
                    else if(daysSplit[temp] == "MF"){
                        if((this.convert24to12(timesSplit[0]) < this.state.mondayTimeBegin || this.convert24to12(timesSplit[1]) > this.state.mondayTimeEnd) || (this.convert24to12(timesSplit[0]) < this.state.fridayTimeBegin || this.convert24to12(timesSplit[1]) > this.state.fridayTimeEnd)){
                            constraintViolated = true;
                            break;
                        }
                    }
                }
                //Now checks to see if semester constraint would be violated
                let courseOfferedSemester = preferredCourses[i].semester
                console.log(courseOfferedSemester);
                if(loopNextSem != courseOfferedSemester)
                {
                    constraintViolated = true;
                }
                if(constraintViolated){
                    continue;
                }
                //Now checks degree requirement constraint
                let courseStr = preferredCourses[i].department + " " + preferredCourses[i].courseNumber;
                let department = preferredCourses[i].department
                let degreeReqFound = false;
                for(let remainLoop = 0; remainLoop < remainingCourses.length; remainLoop++){
                    let remainingCoursesSplit = remainingCourses[remainLoop].split("/");
                    for(let splitLoop = 0; splitLoop < remainingCoursesSplit.length; splitLoop++){
                        console.log(remainingCoursesSplit[splitLoop]);
                        if(courseStr == remainingCoursesSplit[splitLoop]){
                            degreeReqFound = true;
                        }
                    }
                }
                if(!degreeReqFound){
                    if(preferredCourses[i].credits > editElectiveCredits){
                        continue;
                    }
                    else{
                        electiveCourse = true;
                    }
                }
                //finally pushes it to the semester plan
                if(preferredCourses[i].credits <= loopSemCredits){
                    semCourses.push(preferredCourses[i]);
                    for(let j = 0; j < remainingCourses.length; j++){
                        let remainingCoursesSplit = remainingCourses[j].split("/");
                        for(let splitLoop = 0; splitLoop < remainingCoursesSplit.length; splitLoop++){
                            console.log(remainingCoursesSplit[splitLoop]);
                            if(courseStr == remainingCoursesSplit[splitLoop] ){
                                remainingCourses.splice(j, 1);
                            }
                        }
                    }
                    coursePlanWeight += 12;
                    if(electiveCourse){
                        editElectiveCredits = editElectiveCredits - preferredCourses[i].credits;
                        loopSemCredits = loopSemCredits - preferredCourses[i].credits;
                    }
                    else{
                        loopSemCredits -= preferredCourses[i].credits;
                    }
                }
                if(loopSemCredits == 0){
                    break;
                }
            }
            //end of preferred course loop, check to see if the credit limit was reached for the semester
            if(loopSemCredits == 0){
                coursePlan.push(semCourses);
                remainingSemesters = remainingSemesters - 1;
            }
            else{
                await this.getAllCourses();
                let nonPreferredCourses = this.state.allCourseVals;
                console.log(nonPreferredCourses)
                for(let i = 0; i < nonPreferredCourses.length; i++){
                    let constraintViolated = false;
                    let electiveCourse = false;
                    let requiredCourseFlag = false;
                    for(let j = 0; j < remainingCourses.length; j++){
                        let tempStrArr = remainingCourses[j].split("/");
                        for(let k = 0; k < tempStrArr.length; k++){
                            if(nonPreferredCourses[i].department + " " + nonPreferredCourses[i].courseNumber == tempStrArr[k]){
                                requiredCourseFlag = true;
                            }
                        }
                    }
                    if(nonPreferredCourses[i].department == this.state.major){
                        requiredCourseFlag = true;
                    }
                    console.log(requiredCourseFlag);
                    if(!requiredCourseFlag){
                        continue;
                    }
                    for(let j = 0; j < avoidedCourses.length; j++){
                        console.log(avoidedCourses[j]);
                        if(nonPreferredCourses[i].department + " " + nonPreferredCourses[i].courseNumber == avoidedCourses[j].department + " " + avoidedCourses[j].courseNumber){
                            constraintViolated = true;
                        }
                    }
                    if(constraintViolated){
                        continue;
                    }
                //checks to see if any time constraints are violated, if so don't add course to plan
                let initSplit = nonPreferredCourses[i].days.split(" ");
                let daysSplit = initSplit[0].split("/");
                let timesSplit = initSplit[1].split("-");
                for(let temp = 0; temp < daysSplit.length; temp++){
                    if(daysSplit[temp] == "MW"){
                        if((this.convert24to12(timesSplit[0]) < this.state.mondayTimeBegin || this.convert24to12(timesSplit[1]) > this.state.mondayTimeEnd) || (this.convert24to12(timesSplit[0]) < this.state.wednesdayTimeBegin || this.convert24to12(timesSplit[1]) > this.state.wednesdayTimeEnd)){
                            constraintViolated = true;
                        }
                    }
                    else if(daysSplit[temp] == "TUTH"){
                        if((this.convert24to12(timesSplit[0]) < this.state.tuesdayTimeBegin || this.convert24to12(timesSplit[1]) > this.state.tuesdayTimeEnd) || (this.convert24to12(timesSplit[0]) < this.state.thursdayTimeBegin || this.convert24to12(timesSplit[1]) > this.state.thursdayTimeEnd)){
                            constraintViolated = true;
                        }
                    }
                    else if(daysSplit[temp] == "MWF"){
                        if((this.convert24to12(timesSplit[0]) < this.state.mondayTimeBegin || this.convert24to12(timesSplit[1]) > this.state.mondayTimeEnd) || (this.convert24to12(timesSplit[0]) < this.state.wednesdayTimeBegin || this.convert24to12(timesSplit[1]) > this.state.wednesdayTimeEnd)  && (this.convert24to12(timesSplit[0]) < this.state.fridayTimeBegin || this.convert24to12(timesSplit[1]) > this.state.fridayTimeEnd)){
                            constraintViolated = true;
                        }
                    }
                    else if(daysSplit[temp] == "MF"){
                        if((this.convert24to12(timesSplit[0]) < this.state.mondayTimeBegin || this.convert24to12(timesSplit[1]) > this.state.mondayTimeEnd) || (this.convert24to12(timesSplit[0]) < this.state.fridayTimeBegin || this.convert24to12(timesSplit[1]) > this.state.fridayTimeEnd)){
                            constraintViolated = true;
                        }
                    }
                }
                //Now checks to see if semester constraint would be violated
                let courseOfferedSemester = nonPreferredCourses[i].semester
                console.log(courseOfferedSemester);
                if(loopNextSem != courseOfferedSemester)
                {
                    constraintViolated = true;
                }
                if(constraintViolated){
                    continue;
                }
                console.log("Here")
                //Now checks degree requirement constraint
                let courseStr = nonPreferredCourses[i].department + " " + nonPreferredCourses[i].courseNumber;
                let degreeReqFound = false;
                for(let remainLoop = 0; remainLoop < remainingCourses.length; remainLoop++){
                    let remainingCoursesSplit = remainingCourses[remainLoop].split("/");
                    for(let splitLoop = 0; splitLoop < remainingCoursesSplit.length; splitLoop++){
                        console.log(remainingCoursesSplit[splitLoop]);
                        if(courseStr == remainingCoursesSplit[splitLoop]){
                            degreeReqFound = true;
                            break;
                        }
                    }
                }
                if(!degreeReqFound){
                    if(nonPreferredCourses[i].credits > editElectiveCredits){
                        continue;
                    }
                    else{
                        electiveCourse = true;
                    }
                }
                //finally pushes it to the semester plan
                if(nonPreferredCourses[i].credits <= loopSemCredits){
                    semCourses.push(nonPreferredCourses[i]);
                    coursePlanWeight += 10;
                    if(electiveCourse){
                        editElectiveCredits = editElectiveCredits - nonPreferredCourses[i].credits;
                        loopSemCredits = loopSemCredits - nonPreferredCourses[i].credits;
                    }
                    else{
                        loopSemCredits -= nonPreferredCourses[i].credits;
                    }
                }
                if(loopSemCredits == 0){
                    break;
                }
                }
                coursePlan.push(semCourses);
                remainingSemesters = remainingSemesters - 1;
            }
        }
        return coursePlan;
    }

    approveCousePlan = async () => {
        
        let approvedPlan ={sbuID: this.state.studentID, semesters: {}}
        let currentCoursePlan = this.state.currentCoursePlan;
        console.log(currentCoursePlan);
        let semesters = {}
        for (const semester of currentCoursePlan){;
            console.log(semester);
            for(const course of semester){
                console.log(course);
                if(semesters.hasOwnProperty(course.semester)){
                    semesters[course.semester][Object.keys(course.semester).length.toString()] = course
                }else{
                    semesters[course.semester] = { "0": course}
                }
            }
        }

        approvedPlan.semesters = semesters
        console.log(approvedPlan)
        let body = {"studentID": this.state.sbuID, coursePlan: approvedPlan}
        let header = {
            headers: {
              "Content-Type": "application/json",
            },
          }; 

        await axios.post('/api/edit_student/addCoursePlan', body, header)

    }

    onChange = (event) => {
        this.setState({[event.target.id]: event.target.value});
    }

    componentDidMount = async() => {
        this.getDegreeRequirements();
        this.getAllCourses();
        this.getGrades();
    }

    render(){
        return(
            <div>
            <NavbarGPD />
            <br></br>
            <Row>
                <Col l={2}>
                    <Card className="grey lighten-3">
                        <Row>
                            <Col l={12}>
                                <Button onClick={this.smartSuggestCoursePlan}>Smart Suggestion</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col l={12}>
                                <b><u>Student Suggestions</u></b>
                            </Col>
                        </Row>
                        <Row>
                            <Col l={12}>
                                <b><u>Max Credits:</u></b>
                                <input type="number" id="maxCredits" name="credits" step="1" min="0" max="24" onChange={this.onChange}></input>
                            </Col>
                        </Row>
                        <Row>
                            <Col l={12}>
                                <b><u>Max Semesters:</u></b>
                                <input type="number" id="remainingSemesters" name="credits" step="1" min="0" max="4" onChange={this.onChange}></input>
                            </Col>
                        </Row>
                        <Row>
                            <Col l={12}>
                                <b><u>Course(s) to Avoid</u></b>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th data-field="Name">Course Name:</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.allCourses.map((course) => (
                                            <tr>
                                                <td><Checkbox id={course + "prefer"} value={course} 
                                                onChange={(e) => {this.state.avoidedCourses.includes(e.target.value) ? this.setState({avoidedCourses: this.state.avoidedCourses.filter((obj) => obj !== e.target.value)}) : this.setState({avoidedCourses: [...this.state.avoidedCourses, e.target.value]})}}  
                                                label={<span style={{color: "black"}}>{course}</span>}></Checkbox></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        <Row>
                            <Col l={12}>
                                <b><u>Preferred Course(s)</u></b>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th data-field="Name">Course Name:</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.allCourses.map((course) => (
                                            <tr>
                                                <td><Checkbox id={course + "avoid"} value={course} onChange={(e) => {this.state.preferredCourses.includes(e.target.value) ? this.setState({preferredCourses: this.state.preferredCourses.filter((obj) => obj !== e.target.value)}) : this.setState({preferredCourses: [...this.state.preferredCourses, e.target.value]})}} label={<span style={{color: "black"}}>{course}</span>}></Checkbox></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col l={8} offset="l1">
                    <Row>
                    <Card className="grey lighten-3">
                        <Row>
                            <Col l={4}>
                            </Col>
                        </Row>
                        <Row>
                            <Col l={12}>
                                <Table centered>
                                    <thead>
                                        <tr>
                                            <th data-field="Name">Course</th>
                                            <th data-field="Credit">Credit(s)</th>
                                            <th data-field="Days">Days</th>
                                            <th data-field="Semester">Semester</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.currentCoursePlan.map((semester) => {
                                            let tempArr = semester;
                                            console.log(semester);
                                            return (semester.map((course) => {
                                                return(<tr>
                                                    <td>{course.department + " " + course.courseNumber}</td>
                                                    <td>{course.credits}</td>
                                                    <td>{course.days}</td>
                                                    <td>{course.semester}</td>
                                                </tr>);
                                            }));
                                        })}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        <Row>
                            <Col l={6} offset="l3">
                                <Button onClick={() => this.approveCousePlan()}>Approve Course Plan</Button>
                            </Col>
                        </Row>
                    </Card>
                    </Row>
                    <Row>
                        <Card className="grey lighten-3">
                            <b><u>Preferred Timeslots for Courses:</u></b>
                            <Row></Row>
                            <Row>
                                <Col l={3}>
                                    <b><u>Monday</u></b>
                                </Col>
                                <Col l={3}>
                                    <input type="time" id="mondayTimeBegin" onChange={this.onChange}></input>
                                </Col>
                                <Col l={3}>
                                    <b>to</b>
                                </Col>
                                <Col l={3}>
                                    <input type="time" id="mondayTimeEnd" onChange={this.onChange}></input>
                                </Col>
                            </Row>
                            <Row>
                                <Col l={3}>
                                    <b><u>Tuesday</u></b>
                                </Col>
                                <Col l={3}>
                                    <input type="time" id="tuesdayTimeBegin" onChange={this.onChange}></input>
                                </Col>
                                <Col l={3}>
                                    <b>to</b>
                                </Col>
                                <Col l={3}>
                                    <input type="time" id="tuesdayTimeEnd" onChange={this.onChange}></input>
                                </Col>
                            </Row>
                            <Row>
                                <Col l={3}>
                                    <b><u>Wednesday</u></b>
                                </Col>
                                <Col l={3}>
                                    <input type="time" id="wednesdayTimeBegin" onChange={this.onChange}></input>
                                </Col>
                                <Col l={3}>
                                    <b>to</b>
                                </Col>
                                <Col l={3}>
                                    <input type="time" id="wednesdayTimeEnd" onChange={this.onChange}></input>
                                </Col>
                            </Row>
                            <Row>
                                <Col l={3}>
                                    <b><u>Thursday</u></b>
                                </Col>
                                <Col l={3}>
                                    <input type="time" id="thursdayTimeBegin" onChange={this.onChange}></input>
                                </Col>
                                <Col l={3}>
                                    <b>to</b>
                                </Col>
                                <Col l={3}>
                                    <input type="time" id="thursdayTimeEnd" onChange={this.onChange}></input>
                                </Col>
                            </Row>
                            <Row>
                                <Col l={3}>
                                    <b><u>Friday</u></b>
                                </Col>
                                <Col l={3}>
                                    <input type="time" id="fridayTimeBegin" onChange={this.onChange}></input>
                                </Col>
                                <Col l={3}>
                                    <b>to</b>
                                </Col>
                                <Col l={3}>
                                    <input type="time" id="fridayTimeEnd" onChange={this.onChange}></input>
                                </Col>
                            </Row>
                            <Button onClick={this.onClickSuggestPlan}>Suggest Course Plan</Button>
                        </Card>
                    </Row>
                </Col>
            </Row>
            </div>
        );
    }
}

export default SuggestCoursePlanGPD;