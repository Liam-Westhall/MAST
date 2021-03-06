import React, { Component} from 'react'
import { Card, Row, Col, TextInput, Button, Collapsible, CollapsibleItem, Table, Checkbox, Navbar } from 'react-materialize'
import axios from 'axios'
import NavbarStudent from './NavbarStudent';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

class StudentInfo extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentStudent: "",
            firstName: "",
            lastName: "",
            email: this.props.location.state.email,
            major: "",
            entrySemester: "",
            track: "",
            sbuID: "",
            expectedGraduation: "",
            rerender: false, 
            degreeData: [],
            comments: [],
            coursePlan: {},
        };
    }
        
    onChange = (event) => {
            this.setState({[event.target.id]: event.target.value});
        }
        onChangeName = (event) => {
            let nameStr = event.target.value.split(" ");
            this.setState({firstName: nameStr[0], lastName: nameStr[1]});
        }


        confirmAddComment = async () => {
            let newComments = this.state.comments
            console.log(this.state.currentComment);
            newComments.push({message: this.state.currentComment});
            console.log(newComments);
            let body = {sbuID: this.state.sbuID, comment: this.state.currentComment};
            let header = {
                headers: {
                  "Content-Type": "application/json",
                },
              }; 
            await axios.post("/api/comments/add_comment", body, header).then(this.setState({comments: newComments})).catch((err) => console.log(err));
        }

        findStudent = async () => {
            console.log(this.props.location.state.email);
            let body = {email: this.props.location.state.email}
            console.log(body);
            let res = await axios.post("/api/students/find_student", body).catch((err) => console.log('caught', err));
            let people = res.data;
            console.log(people);
            this.setState({
                currentStudent: people.student,
                firstName: people.user.firstName,
                lastName: people.user.lastName,
                major: people.student.department,
                entrySemester: people.student.entrySemester,
                track: people.student.track,
                sbuID: people.student.sbuID,
                comments: people.comments,
                coursePlan: people.coursePlan
            });
        }   

        onChange = (event) => {
            this.setState({[event.target.id]: event.target.value});
        }
    
        onChangeName = (event) => {
            let nameStr = event.target.value.split(" ");
            this.setState({firstName: nameStr[0], lastName: nameStr[1]});
        }
    
        //Is called when the confirm button in the edit student information section is pressed
        confirmEdit = async () => {
            let body = {userID: this.state.userID, studentID: this.state.studentID, firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email, sbuID: this.state.sbuID, major: this.state.major, entrySemester: this.state.entrySemester, track: this.state.track};        
            let header = {
                headers: {
                  "Content-Type": "application/json",
                },
              };    
            axios.post("/api/edit_student", body, header).catch((error) => console.log(error));
    
            await axios.get('/api/students').catch((err) => console.log('caught', err));
        }
    
        confirmAddComment = async () => {
            let newComments = this.state.comments
            newComments.push({message: this.state.currentComment});
            let body = {sbuID: this.state.sbuID, comment: this.state.currentComment};
            let header = {
                headers: {
                  "Content-Type": "application/json",
                },
              }; 
            await axios.post("/api/comments/add_comment", body, header).then(this.setState({comments: newComments})).catch((err) => console.log(err));
        }
    
        getDegreeRequirements = async () => {
            let degrees = await axios.get('/api/degrees').catch((err) => console.log('caught', err));
            let degreeData = degrees.data
            for(let i = 0; i < degreeData.length; i++){
                let tempDegree = degreeData[i];
                if(this.state.major.replace(/ /g,'') === tempDegree.department){
                    this.setState({
                        degreeData: degreeData[i].json,
                        rerender: true
                    });
                    break;
                }
            }
        }
    
        onChangeComment = async (index) => { 
            this.setState({
                currentCommentIndex: index
            });
            
        }
    
        onDeleteComment = async () => {
            let body = {sbuID: this.state.sbuID, currentComment: this.state.comments[this.state.currentCommentIndex]}
            let header = {
                headers: {
                  "Content-Type": "application/json",
                },
              }; 
            let comments = this.state.comments
            comments.splice(this.state.currentCommentIndex, 1);
            await axios.post("/api/comments/delete_comment", body, header).then(this.setState({comments: comments})).catch((err) => console.log('caught', err));
        }
    
        confirmSuggestPlan = async () => {
            this.setState({
                suggestPlan: true
            });
        }
        componentDidMount = async () => {
            await this.findStudent();
            await this.getDegreeRequirements();
            await this.getAllGrades();
        }
    
        getCompletedCourse = (course) => {
            return this.checkCompletedCourse(course);
        }
    
        getAllGrades = async () => {
            let header = {
                headers: {
                  "Content-Type": "application/json",
                },
              }; 
            let body = {id: this.state.currentStudent.id}
            console.log(body);
            let res = await axios.post("/api/courses/getgrades", body, header).catch((err) => console.log('caught error'));
            this.setState({grades: res.data})
        }
    
        checkCompletedCourse = (course) => {
            let courseStrArr = course.split("/")
            for(let i = 0; i < courseStrArr.length; i++){
                for(var grade in this.state.grades){
                    if(courseStrArr[i] === (this.state.grades[grade].department + " " + this.state.grades[grade].course_num).toString())
                    {
                        if(this.state.grades[grade].grade === "A" || this.state.grades[grade].grade === "B") {
                            return true;
                        }
                        else if(this.state.grades[grade].grade === "C"){
                            if(this.state.grades[grade].grade.length > 1){
                                if(this.state.grades[grade].grade.charAt(1) !== "-"){
                                    return true;
                                }
                            }
                            else{
                                return false;
                            }
                        }
                    }
                }
            }
            return false;
        }   
    
        checkCourseInProgress  = (arr, course) => {
            let courseStrArr = course.split("/")
            for(let i = 0; i < courseStrArr.length; i++){
                for(let j = 0; j < arr.length; j++){
                    let courseStr = arr[j].department + " " + arr[j].courseNum;
                    if(courseStrArr[i] === courseStr){
                        return true;
                    }
                }
            }
            return false;
        }
    
        returnTrueVal = (value) => {
            return value;
        }

        render(){
            let dropdown;
            var arrCourses = [];
            let tempCoursePlan = this.state.coursePlan
            if(tempCoursePlan){
                Object.keys(tempCoursePlan).forEach(function (key){
                    Object.keys(tempCoursePlan[key]).forEach(function (key2){
                            Object.keys(tempCoursePlan[key][key2]).forEach(function (key3){
                                arrCourses.push(tempCoursePlan[key][key2][key3])
                            }) 
                    })
                });
            }
            if (this.state.major.replace(/ /g,'') === "AMS" && this.state.rerender) {
                if(this.state.track === "Computational Applied Mathematics"){
                    dropdown = <div>
                        <Collapsible class="disabled">
                            {this.state.degreeData.requirements.tracks.comp.courses.map((course) => {
                                
                                let trueVal = this.checkCompletedCourse(course);
                                if(trueVal === true){
                                    return <CollapsibleItem icon={<Checkbox checked disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                                else if(this.checkCourseInProgress(arrCourses, course) === true){
                                    return <CollapsibleItem icon={<Checkbox indeterminate disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                                else{
                                    return <CollapsibleItem icon={<Checkbox disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                            })}
                        </Collapsible>
                    </div>;
                }
                else if(this.state.track === "Operations Research"){
                    dropdown = <div>
                        <Collapsible class="disabled">
                            {this.state.degreeData.requirements.tracks.bio.courses.map((course) => {
                                
                                let trueVal = this.checkCompletedCourse(course);
                                if(trueVal === true){
                                    return <CollapsibleItem icon={<Checkbox checked disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                                else if(this.checkCourseInProgress(arrCourses, course) === true){
                                    return <CollapsibleItem icon={<Checkbox indeterminate disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                                else{
                                    return <CollapsibleItem icon={<Checkbox disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                            })}
                        </Collapsible>
                    </div>;
                }
                else if(this.state.track === "Computational Biology"){
                    dropdown = <div>
                        <Collapsible class="disabled">
                            {this.state.degreeData.requirements.tracks.op.courses.map((course) => {
                                
                                let trueVal = this.checkCompletedCourse(course);
                                if(trueVal === true){
                                    return <CollapsibleItem icon={<Checkbox checked disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                                else if(this.checkCourseInProgress(arrCourses, course) === true){
                                    return <CollapsibleItem icon={<Checkbox indeterminate disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                                else{
                                    return <CollapsibleItem icon={<Checkbox disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                            })}
                        </Collapsible>
                    </div>;
                }
                else if(this.state.track === "Statistics"){
                    dropdown = <div>
                        <Collapsible class="disabled">
                            {this.state.degreeData.requirements.tracks.stats.courses.map((course) => {
                                
                                let trueVal = this.checkCompletedCourse(course);
                                if(trueVal === true){
                                    return <CollapsibleItem icon={<Checkbox checked disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                                else if(this.checkCourseInProgress(arrCourses, course) === true){
                                    return <CollapsibleItem icon={<Checkbox indeterminate disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                                else{
                                    return <CollapsibleItem icon={<Checkbox disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                            })}
                        </Collapsible>
                    </div>;
                }
                else if(this.state.track === "Quanitative Finance"){
                    dropdown = <div>
                        <Collapsible class="disabled">
                            {this.state.degreeData.requirements.tracks.quan.courses.map((course) => {
                                
                                let trueVal = this.checkCompletedCourse(course);
                                if(trueVal === true){
                                    return <CollapsibleItem icon={<Checkbox checked disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                                else if(this.checkCourseInProgress(arrCourses, course) === true){
                                    return <CollapsibleItem icon={<Checkbox indeterminate disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                                else{
                                    return <CollapsibleItem icon={<Checkbox disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                            })}
                        </Collapsible>
                    </div>;
                }
            }
            else if (this.state.major.replace(/ /g,'') === "BMI" && this.state.rerender){
                if(this.state.track === "Project/Imaging Informatics"){
                    dropdown = <div>
                        <Collapsible class="disabled">
                            {this.state.degreeData.requirements.tracks.proj_imag.courses.map((course) => {
                                
                                let trueVal = this.checkCompletedCourse(course);
                                if(trueVal === true){
                                    return <CollapsibleItem icon={<Checkbox checked disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                                else if(this.checkCourseInProgress(arrCourses, course) === true){
                                    return <CollapsibleItem icon={<Checkbox indeterminate disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                                else{
                                    return <CollapsibleItem icon={<Checkbox disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                            })}
                        </Collapsible>
                    </div>;
                }
                else if(this.state.track === "Project/Clinical Informatics"){
                    dropdown = <div>
                    <Collapsible class="disabled">
                        {this.state.degreeData.requirements.tracks.proj_clinical.courses.map((course) => {
                            
                            let trueVal = this.checkCompletedCourse(course);
                            if(trueVal === true){
                                return <CollapsibleItem icon={<Checkbox checked disabled id={course}/>} header={course}></CollapsibleItem>
                            }
                            else if(this.checkCourseInProgress(arrCourses, course) === true){
                                return <CollapsibleItem icon={<Checkbox indeterminate disabled id={course}/>} header={course}></CollapsibleItem>
                            }
                            else{
                                return <CollapsibleItem icon={<Checkbox disabled id={course}/>} header={course}></CollapsibleItem>
                            }
                        })}
                    </Collapsible>
                </div>;
                }
                else if(this.state.track === "Project/Translational Bio-Informatics"){
                    dropdown = <div>
                        <Collapsible class="disabled">
                            {this.state.degreeData.requirements.tracks.proj_trans.courses.map((course) => {
                                
                                let trueVal = this.checkCompletedCourse(course);
                                if(trueVal === true){
                                    return <CollapsibleItem icon={<Checkbox checked disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                                else if(this.checkCourseInProgress(arrCourses, course) === true){
                                    return <CollapsibleItem icon={<Checkbox indeterminate disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                                else{
                                    return <CollapsibleItem icon={<Checkbox disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                            })}
                        </Collapsible>
                    </div>;
                }
                else if(this.state.track === "Thesis/Clinical Informatics"){
                    dropdown = <div>
                        <Collapsible class="disabled">
                            {this.state.degreeData.requirements.tracks.thesis_clinical.courses.map((course) => {
                                
                                let trueVal = this.checkCompletedCourse(course);
                                if(trueVal === true){
                                    return <CollapsibleItem icon={<Checkbox checked disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                                else if(this.checkCourseInProgress(arrCourses, course) === true){
                                    return <CollapsibleItem icon={<Checkbox indeterminate disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                                else{
                                    return <CollapsibleItem icon={<Checkbox disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                            })}
                        </Collapsible>
                    </div>;
                }
                else if(this.state.track === "Thesis/Translational Bio-Informatics"){
                    dropdown = <div>
                        <Collapsible class="disabled">
                            {this.state.degreeData.requirements.tracks.thesis_trans.courses.map((course) => {
                                
                                let trueVal = this.checkCompletedCourse(course);
                                if(trueVal === true){
                                    return <CollapsibleItem icon={<Checkbox checked disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                                else if(this.checkCourseInProgress(arrCourses, course) === true){
                                    return <CollapsibleItem icon={<Checkbox indeterminate disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                                else{
                                    return <CollapsibleItem icon={<Checkbox disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                            })}
                        </Collapsible>
                    </div>;
                }
                else if(this.state.track === "Thesis/Imaging Informatics"){
                    dropdown = <div>
                        <Collapsible class="disabled">
                            {this.state.degreeData.requirements.tracks.thesis_imag.courses.map((course) => {
                                
                                let trueVal = this.checkCompletedCourse(course);
                                if(trueVal === true){
                                    return <CollapsibleItem icon={<Checkbox checked disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                                else if(this.checkCourseInProgress(arrCourses, course) === true){
                                    return <CollapsibleItem icon={<Checkbox indeterminate disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                                else{
                                    return <CollapsibleItem icon={<Checkbox disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                            })}
                        </Collapsible>
                    </div>;
                }
            }
            else if(this.state.major.replace(/ /g,'') === "CSE" && this.state.rerender){
                if(this.state.track === "Basic"){
                    dropdown = <div>
                    <Collapsible class="disabled">
                        {this.state.degreeData.requirements.tracks.basic.courses.map((course) => {
                            let completedCheck = false;
                            let trueVal = this.checkCompletedCourse(course);
                            if(trueVal == true){
                                return <CollapsibleItem icon={<Checkbox checked disabled id={course}/>} header={course}></CollapsibleItem>
                            }
                            else if(this.checkCourseInProgress(arrCourses, course) == true){
                                return <CollapsibleItem icon={<Checkbox indeterminate disabled id={course}/>} header={course}></CollapsibleItem>
                            }
                            else{
                                return <CollapsibleItem icon={<Checkbox disabled id={course}/>} header={course}></CollapsibleItem>
                            }
                        })}
                    </Collapsible>
                </div>;
                }
                else if(this.state.track === "Advanced"){
                    dropdown = <div>
                    <Collapsible class="disabled">
                        {this.state.degreeData.requirements.tracks.advanced.courses.map((course) => {
                            let completedCheck = false;
                            let trueVal = this.checkCompletedCourse(course);
                            if(trueVal == true){
                                return <CollapsibleItem icon={<Checkbox checked disabled id={course}/>} header={course}></CollapsibleItem>
                            }
                            else if(this.checkCourseInProgress(arrCourses, course) == true){
                                return <CollapsibleItem icon={<Checkbox indeterminate disabled id={course}/>} header={course}></CollapsibleItem>
                            }
                            else{
                                return <CollapsibleItem icon={<Checkbox disabled id={course}/>} header={course}></CollapsibleItem>
                            }
                        })}
                    </Collapsible>
                </div>;
                }
                if(this.state.track === "Thesis"){
                    dropdown = <div>
                    <Collapsible class="disabled">
                        {this.state.degreeData.requirements.tracks.thesis.courses.map((course) => {
                            let completedCheck = false;
                            let trueVal = this.checkCompletedCourse(course);
                            if(trueVal == true){
                                return <CollapsibleItem icon={<Checkbox checked disabled id={course}/>} header={course}></CollapsibleItem>
                            }
                            else if(this.checkCourseInProgress(arrCourses, course) == true){
                                return <CollapsibleItem icon={<Checkbox indeterminate disabled id={course}/>} header={course}></CollapsibleItem>
                            }
                            else{
                                return <CollapsibleItem icon={<Checkbox disabled id={course}/>} header={course}></CollapsibleItem>
                            }
                        })}
                    </Collapsible>
                </div>;
                }
            }
            else if(this.state.major.replace(/ /g,'') === "CE" && this.state.rerender){
                if(this.state.track === "Non-Thesis"){
                    dropdown = <div>
                    <Collapsible class="disabled">
                        {this.state.degreeData.requirements.tracks.non_thesis.courses.map((course) => {
                            
                            let trueVal = this.checkCompletedCourse(course);
                            if(trueVal === true){
                                return <CollapsibleItem icon={<Checkbox checked disabled id={course}/>} header={course}></CollapsibleItem>
                            }
                            else if(this.checkCourseInProgress(arrCourses, course) === true){
                                return <CollapsibleItem icon={<Checkbox indeterminate disabled id={course}/>} header={course}></CollapsibleItem>
                            }
                            else{
                                return <CollapsibleItem icon={<Checkbox disabled id={course}/>} header={course}></CollapsibleItem>
                            }
                        })}
                    </Collapsible>
                </div>;
                }
                else if(this.state.track === "Thesis"){
                    dropdown = <div>
                        <Collapsible class="disabled">
                            {this.state.degreeData.requirements.tracks.thesis.courses.map((course) => {
                                
                                let trueVal = this.checkCompletedCourse(course);
                                if(trueVal === true){
                                    return <CollapsibleItem icon={<Checkbox checked disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                                else if(this.checkCourseInProgress(arrCourses, course) === true){
                                    return <CollapsibleItem icon={<Checkbox indeterminate disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                                else{
                                    return <CollapsibleItem icon={<Checkbox disabled id={course}/>} header={course}></CollapsibleItem>
                                }
                            })}
                        </Collapsible>
                    </div>;
                }
            }
            return(
                this.state.suggestPlan ? <Redirect to={{pathname: "suggest_course_plan_stu", state: {currentEditStudent: this.state.currentStudent, email: this.state.email}}}></Redirect> :
                <div align="left">
                    <NavbarStudent />
                    <br></br>
                    <Row>
                        <Col l={6}>
                            <b>Edit Student: {this.state.firstName + " " + this.state.lastName}</b>
                        </Col>
                        <Col l={6}>
                            <b>View/Edit Comments</b>
                        </Col>
                    </Row>
                    <Row>
                        <Col l={6}>
                            <Card className="blue-grey">
                                <Row>
                                    <Col l={6}>
                                        <span align="left" class="white-text">Full Name:</span>
                                    </Col>
                                    <Col l={6}>
                                        <span class="white-text">Major:</span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col l={6}>
                                        <TextInput class="white" onChange={this.onChangeName} value={this.state.firstName + " " + this.state.lastName} id ="fullName">
                                        </TextInput>
                                    </Col>
                                    <Col l={6}>
                                        <TextInput class="white" onChange={this.onChange} value={this.state.major} id="major">
                                        </TextInput>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col l={6}>
                                        <span align="left" class="white-text">Email:</span>
                                    </Col>
                                    <Col l={6}>
                                        <span class="white-text">Entry Semester:</span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col l={6}>
                                        <TextInput class="white" onChange={this.onChange} value={this.state.email} id="email">
                                        </TextInput>
                                    </Col>
                                    <Col l={6}>
                                        <TextInput class="white" onChange={this.onChange} value={this.state.entrySemester} id="entrySemester">
                                        </TextInput>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col l={6}>
                                        <span align="left" class="white-text">SBU ID:</span>
                                    </Col>
                                    <Col l={6}>
                                        <span class="white-text">Expected Graduation:</span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col l={6}>
                                        <TextInput class="white" disabled onChange={this.onChange} value={this.state.sbuID} id="sbuID">
                                        </TextInput>
                                    </Col>
                                    <Col l={6}>
                                        <TextInput class="white" onChange={this.onChange} value={this.state.expectedGraduation} id="expectedGraduation"> 
                                        </TextInput>
                                    </Col>
                                </Row>
                                <Row>
                                <Col l={6} offset="l6">
                                        <span align="left" class="white-text">Track:</span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col l={6}>
                                        <Button onClick={this.confirmEdit}>Confirm Changes</Button>
                                    </Col>
                                    <Col l={6}>
                                        <TextInput class="white" onChange={this.onChange} value={this.state.track} id="track"> 
                                        </TextInput>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col l="6">
                            <Card className="blue-grey">
                                <Row>
                                    <Col l={6}>
                                        <Collapsible>
                                            {this.state.comments.map((comment, index) =>
                                            (<CollapsibleItem header={comment.message} onClick={this.onChangeComment.bind(this, index)}></CollapsibleItem>))}
                                        </Collapsible>
                                    </Col>
                                    <Col><TextInput placeholder="Comment..." class="white" value={this.state.currentComment} onChange={this.onChange} id="currentComment"></TextInput></Col>
                                </Row>
                                <Row>
                                    <Col l={6}>
                                    </Col>
                                    <Col l={6}>
                                        <Button onClick={this.confirmAddComment}>Add Comment</Button>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col l={6}>
                            <b>Current Course Plan:</b>
                        </Col>
                        <Col l={6}>
                            <b>Degree Requirements:</b>
                        </Col>
                    </Row>
                    <Row>
                        <Col l={6}>
                        <Card className="blue-grey">
                            <Row className="white">
                                <Col l={12}>
                                    <Table>
                                        <thead>
                                            <th>Course</th>
                                            <th>Credits</th>
                                            <th>Semester</th>
                                        </thead>
                                        <tbody>
                                            {arrCourses.map((course) => (
                                                <tr>
                                                    <td>{course.department + " " + course.courseNum}</td>
                                                    <td>{course.credits}</td>
                                                    <td>{course.semester + " " + course.year}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <Button onClick={this.confirmSuggestPlan}>Suggest Course Plan</Button>
                        </Card>
                        </Col>
                        <Col l={6}>
                        <Card className="blue-grey">
                            <Row>
                            <Col l={12}>
                                {dropdown}
                            </Col>
                            </Row>
                        </Card>
                        </Col>    
                    </Row>
                    <br></br>
                </div>
                
            );
        }
    }
    export default StudentInfo;