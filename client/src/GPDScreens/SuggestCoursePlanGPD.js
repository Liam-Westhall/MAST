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
            degreeData: [],
            allCourses: [],
            maxCredits: 0,
            remainingSemesters: 0,
            mondayTimeBegin: "",
            mondayTimeEnd: "",
            tuesdayTimeBegin: "",
            tuesdayTimeEnd: "",
            wednesdayTimeBegin: "",
            wednesdayTimeEnd: "",
            thursdayTimeBegin: "",
            thursdayTimeEnd: "",
            fridayTimeBegin: "",
            fridayTimeEnd: "", 
            currentSemester: ""
        };
    }

    //gets all of the grades in the database for the current student
    getGrades = async () => {
        let body = {id: this.state.sbuID};
        let header = {
            headers: {
              "Content-Type": "application/json",
            },
          }; 
        let res = await axios.post("http://localhost:5000/api/courses/getgrades").catch((err) => console.log(err));
        return res.data;
    }

    //gets all the degree requirements for a specific major/track
    getDegreeRequirements = async () => {
        let degrees = await axios.get('api/degrees');
        let degreeData = degrees.data
        for(let i = 0; i < degreeData.length; i++){
            let tempDegree = degreeData[i];
            console.log(tempDegree);
            if(this.state.major.replace(/ /g,'') == tempDegree.department){
                console.log(this.state.degreeData)
                this.setState({
                    degreeData: degreeData[i].json,
                    rerender: true
                });
                console.log(this.state.degreeData)
                break;
            }
        }
    }

    //compares grades with required courses for major and track to check what courses still need to be taken
    searchCourses = async (grades, required_courses, elective_credits) => {
        let finished_courses = []
        let temp_elective_credits = elective_credits
        for(let i = 0; i < grades.length; i++){
            if(grades[i].grade.charAt(0) <= "C"){
                if(grades[i].grade.length > 1){
                    if(grades[i].grade.charAt(1) != "-"){
                        for(let j = 0; j < required_courses.length; j++){
                            let temp_courses = required_courses[j].split('/');
                            let found_course = false;
                            for(let k = 0; k < temp_courses.length; k++){
                                if((grades[i].department + " " + grades[i].course_num) == temp_courses[k]){
                                    finished_courses.push(grades[i].department + " " + grades[i].course_num);
                                    required_courses.splice(j, 1);
                                    found_course = true;
                                    break;
                                }
                            }
                            if(!found_course){
                                let duplicate = false;
                                for(let l = 0; l < finished_courses.length; l++){
                                    if((grades[i].department + " " + grades[i].course_num) == finished_courses[l]){
                                        duplicate = true;
                                        break;
                                    }
                                }
                                if(!duplicate){
                                    finished_courses.push(grades[i].department + " " + grades[i].course_num);
                                    temp_elective_credits = temp_elective_credits - (grades[i].credits);
                                }
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
        let grades = this.getGrades();
        let required_courses = []
        let elective_credits = 0
        let remaining_courses = []
        if (this.state.major.replace(/ /g,'') == "AMS") {
            if(this.state.track == "Computational Applied Mathematics"){
                required_courses = this.state.degreeData.requirements.tracks.comp.courses
                elective_credits = this.state.degreeData.requirements.tracks.comp.elective_creds
                remaining_courses = this.searchCourses(grades, required_courses);
            }
            else if(this.state.track == "Computational Biology"){
                required_courses = this.state.degreeData.requirements.tracks.bio.courses
                elective_credits = this.state.degreeData.requirements.tracks.bio.elective_creds
                remaining_courses = this.searchCourses(grades, required_courses);
            }
            else if(this.state.track == "Operations Research"){
                required_courses = this.state.degreeData.requirements.tracks.op.courses
                elective_credits = this.state.degreeData.requirements.tracks.op.elective_creds
                remaining_courses = this.searchCourses(grades, required_courses);
            }
            else if(this.state.track == "Statistics"){
                required_courses = this.state.degreeData.requirements.tracks.stats.courses
                elective_credits = this.state.degreeData.requirements.tracks.stats.elective_creds
                remaining_courses = this.searchCourses(grades, required_courses);
            }
            else if(this.state.track == "Quanitative Finance"){
                required_courses = this.state.degreeData.requirements.tracks.quan.courses
                elective_credits = this.state.degreeData.requirements.tracks.quan.elective_creds
                remaining_courses = this.searchCourses(grades, required_courses);
            }
        } 
    }

    //gets the total credits from the remaining courses for the student to take
    getCreditsRemainingCourses = async (remainingCourses) => {

    }

    //triggered when "Suggest Course Plan" Button is pressed
    onClickSuggestPlan = async () => {
        let requirementsBody = this.getRemainingCourses();
        let remainingCourses = requirementsBody.required_courses;
        let remainingElectiveCredits = requirementsBody.elective_credits;
        let preferredCourses = this.getPreferredCourses();
        let avoidedCourses = this.getAvoidedCourses();
        let plans = this.suggestCoursePlan(remainingCourses, remainingElectiveCredits);

    }

    //gets the preferred courses from the user input on the website
    getPreferredCourses = async () => {

    }

    //gets the avoided courses from the user input on the website
    getAvoidedCourses = async () => {

    }

    //gets all courses from the database
    getAllCourses = async () => {
        let courses = await axios.get("http://localhost:5000/api/courses/");
        let courseData = courses.data
        let courseNames = []
        for(var course in courseData){
            courseNames.push((courseData[course].department + " " + (courseData[course].courseNumber).toString()));
        }
        courseNames.sort();
        this.setState({
            allCourses: courseNames
        });
        console.log(this.state.allCourses);

    }

    suggestCoursePlan = async (remainingCourses, remainingElectiveCredits, preferredCourses, avoidedCourses) => {
        let totalRemainingCredits = this.getCreditsRemainingCourses(remainingCourses) + remainingElectiveCredits;
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
            //start priority course loop
            for(let i = 0; i < preferredCourses.length; i++){
                let constraintViolated = false;
                let electiveCourse = false;
                //checks to see if any time constraints are violated, if so don't add course to plan
                let initSplit = preferredCourses[i].days.split(" ");
                let daysSplit = initSplit[0].split("/");
                let timesSplit = initSplit[1].split("-");
                for(let temp = 0; temp < daysSplit.length; temp++){
                    if(daysSplit[temp] == "M"){
                        if(timesSplit[0] < this.state.mondayTimeBegin || timesSplit[1] > this.state.mondayTimeEnd){
                            constraintViolated = true;
                            break;
                        }
                    }
                    else if(daysSplit[temp] == "Tu"){
                        if(timesSplit[0] < this.state.tuesdayTimeBegin || timesSplit[1] > this.state.tuesdayTimeEnd){
                            constraintViolated = true;
                            break;
                        }
                    }
                    else if(daysSplit[temp] == "W"){
                        if(timesSplit[0] < this.state.wednesdayTimeBegin || timesSplit[1] > this.state.wednesdayTimeEnd){
                            constraintViolated = true;
                            break;
                        }
                    }
                    else if(daysSplit[temp] == "Th"){
                        if(timesSplit[0] < this.state.thursdayTimeBegin || timesSplit[1] > this.state.thursdayTimeEnd){
                            constraintViolated = true;
                            break;
                        }
                    }
                    else if(daysSplit[temp] == "F"){
                        if(timesSplit[0] < this.state.fridayTimeBegin || timesSplit[1] > this.state.fridayTimeEnd){
                            constraintViolated = true;
                            break;
                        }
                    }
                }
                //Now checks to see if semester constraint would be violated
                let courseOfferedSemester = preferredCourses[i].semester
                if(loopNextSem != courseOfferedSemester)
                {
                    constraintViolated = true;
                }
                if(constraintViolated){
                    continue;
                }
                //Now checks degree requirement constraint
                let courseStr = preferredCourses[i].department + " " + preferredCourses[i].courseNumber;
                let degreeReqFound = false;
                for(let remainLoop = 0; remainLoop < remainingCourses.length; remainLoop++){
                    let remainingCoursesSplit = remainingCourses[remainLoop].split("/");
                    for(let splitLoop = 0; splitLoop < remainingCoursesSplit; splitLoop++){
                        if(courseStr == remainingCoursesSplit[splitLoop]){
                            degreeReqFound = true;
                        }
                    }
                }
                if(!degreeReqFound){
                    if(preferredCourses[i].credits < editElectiveCredits){
                        continue;
                    }
                    else{
                        electiveCourse = true;
                    }
                }
                //finally pushes it to the semester plan
                if(preferredCourses[i].credits >= loopSemCredits){
                    semCourses.push(preferredCourses[i]);
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
                let nonPreferredCourses = this.getAllCourses();
                for(let i = 0; i < nonPreferredCourses.length; i++){
                    let constraintViolated = false;
                    let electiveCourse = false;
                    //checks to see if any time constraints are violated, if so don't add course to plan
                    let initSplit = nonPreferredCourses[i].days.split(" ");
                    let daysSplit = initSplit[0].split("/");
                    let timesSplit = initSplit[1].split("-");
                    for(let temp = 0; temp < daysSplit.length; temp++){
                        if(daysSplit[temp] == "M"){
                            if(timesSplit[0] < this.state.mondayTimeBegin || timesSplit[1] > this.state.mondayTimeEnd){
                                constraintViolated = true;
                                break;
                            }
                        }
                        else if(daysSplit[temp] == "Tu"){
                            if(timesSplit[0] < this.state.tuesdayTimeBegin || timesSplit[1] > this.state.tuesdayTimeEnd){
                                constraintViolated = true;
                                break;
                            }
                        }
                        else if(daysSplit[temp] == "W"){
                            if(timesSplit[0] < this.state.wednesdayTimeBegin || timesSplit[1] > this.state.wednesdayTimeEnd){
                                constraintViolated = true;
                                break;
                            }
                        }
                        else if(daysSplit[temp] == "Th"){
                            if(timesSplit[0] < this.state.thursdayTimeBegin || timesSplit[1] > this.state.thursdayTimeEnd){
                                constraintViolated = true;
                                break;
                            }
                        }
                        else if(daysSplit[temp] == "F"){
                            if(timesSplit[0] < this.state.fridayTimeBegin || timesSplit[1] > this.state.fridayTimeEnd){
                                constraintViolated = true;
                                break;
                            }
                        }
                    }
                    //Now checks to see if semester constraint would be violated
                    let courseOfferedSemester = nonPreferredCourses[i].semester
                    if(loopNextSem != courseOfferedSemester)
                    {
                        constraintViolated = true;
                    }
                    if(constraintViolated){
                        continue;
                    }
                    //Now checks degree requirement constraint
                    let courseStr = nonPreferredCourses[i].department + " " + nonPreferredCourses[i].courseNumber;
                    let degreeReqFound = false;
                    for(let remainLoop = 0; remainLoop < remainingCourses.length; remainLoop++){
                        let remainingCoursesSplit = remainingCourses[remainLoop].split("/");
                        for(let splitLoop = 0; splitLoop < remainingCoursesSplit; splitLoop++){
                            if(courseStr == remainingCoursesSplit[splitLoop]){
                                degreeReqFound = true;
                            }
                        }
                    }
                    if(!degreeReqFound){
                        if(nonPreferredCourses[i].credits < editElectiveCredits){
                            continue;
                        }
                        else{
                            electiveCourse = true;
                        }
                    }
                    //finally pushes it to the semester plan
                    if(nonPreferredCourses[i].credits >= loopSemCredits){
                        semCourses.push(nonPreferredCourses[i]);
                        coursePlanWeight += 10;
                        if(electiveCourse){
                            editElectiveCredits = editElectiveCredits - nonPreferredCourses[i].credits;
                            loopSemCredits = loopSemCredits -nonPreferredCourses[i].credits;
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
    }

    onChange = (event) => {
        this.setState({[event.target.id]: event.target.value});
    }

    testSuggestCoursePlan = (event) => {
        console.log("Haha");
    }

    componentDidMount = async() => {
        this.getDegreeRequirements();
        this.getAllCourses();
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
                                <Button>Smart Suggestion</Button>
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
                                                <td><Checkbox id={course + "prefer"} label={<span style={{color: "black"}}>{course}</span>}></Checkbox></td>
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
                                                <td><Checkbox id={course + "avoid"} label={<span style={{color: "black"}}>{course}</span>}></Checkbox></td>
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
                                <Select
                                    placeholder="Select Semester"
                                />
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
                                            <th data-field="Time">Time</th>
                                            <th data-field="Professor">Professor</th>
                                            <th data-field="Location">Location</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td data-field="Name">Course</td>
                                            <td data-field="Credit">Credit(s)</td>
                                            <td data-field="Days">Days</td>
                                            <td data-field="Time">Time</td>
                                            <td data-field="Professor">Professor</td>
                                            <td data-field="Location">Location</td>
                                        </tr>
                                        <tr>
                                            <td data-field="Name">Course</td>
                                            <td data-field="Credit">Credit(s)</td>
                                            <td data-field="Days">Days</td>
                                            <td data-field="Time">Time</td>
                                            <td data-field="Professor">Professor</td>
                                            <td data-field="Location">Location</td>
                                        </tr>
                                        <tr>
                                            <td data-field="Name">Course</td>
                                            <td data-field="Credit">Credit(s)</td>
                                            <td data-field="Days">Days</td>
                                            <td data-field="Time">Time</td>
                                            <td data-field="Professor">Professor</td>
                                            <td data-field="Location">Location</td>
                                        </tr>
                                    </tbody>
                                </Table>
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
                            <Button>Suggest Course Plan</Button>
                        </Card>
                    </Row>
                </Col>
            </Row>
            </div>
        );
    }
}

export default SuggestCoursePlanGPD;