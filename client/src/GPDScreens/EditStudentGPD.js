import React, { Component} from 'react'
import { Card, Row, Col, Navbar, TextInput, Button, Collapsible, CollapsibleItem, Table } from 'react-materialize'
import {Link, Redirect} from 'react-router-dom'
import axios from 'axios'
import { Checkbox } from 'react-materialize';

class EditStudentGPD extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentStudent: this.props.location.state.currentEditStudent,
            userID: this.props.location.state.currentEditStudent.User.id,
            studentID: this.props.location.state.currentEditStudent.id,
            firstName: this.props.location.state.currentEditStudent.User.firstName,
            lastName: this.props.location.state.currentEditStudent.User.lastName,
            email: this.props.location.state.currentEditStudent.User.email,
            major: this.props.location.state.currentEditStudent.department,
            entrySemester: this.props.location.state.currentEditStudent.entrySemester,
            track: this.props.location.state.currentEditStudent.track,
            sbuID: this.props.location.state.currentEditStudent.sbuID,
            coursePlan: {
                "studentID": 1,
                "semesters": {
                    "F17": {
                        "0": {
                            "department": "CSE",
                            "courseNum": "502",
                            "credits": 3,
                            "semester": "Fall",
                            "year": "2017",
                            "grade": "B"
                        },
                        "1": {
                            "department": "CSE",
                            "courseNum": "503",
                            "credits": 3,
                            "semester": "Fall",
                            "year": "2017",
                            "grade": "A"
                        }
                    },
                    "S17": {
                        "0": {
                            "department": "CSE",
                            "courseNum": "504",
                            "credits": 3,
                            "semester": "Spring",
                            "year": "2017",
                            "grade": "C"
                        },
                        "1": {
                            "department": "CSE",
                            "courseNum": "505",
                            "credits": 3,
                            "semester": "Spring",
                            "year": "2017",
                            "grade": "D"
                        }
                    }
                }
            },
            expectedGraduation: "",
            degreeData: [],
            comments: this.props.location.state.comments,
            rerender: false,
            currentComment: "",
            suggestPlan: false,
            currentCommentIndex: 0
        };
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
        console.log(body)
        let header = {
            headers: {
              "Content-Type": "application/json",
            },
          };    
        axios.post("http://localhost:5000/api/edit_student", body, header).catch((error) => console.log(error));

        await axios.get('/api/students')        
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
        let res = await axios.post("http://localhost:5000/api/comments/add_comment", body, header).then(this.setState({comments: newComments})).catch((err) => console.log(err));
    }

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

    onChangeComment = async (index) => { 
        console.log(this.state.currentCommentIndex)
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
        let res = await axios.post("http://localhost:5000/api/comments/delete_comment", body, header).then(this.setState({comments: comments}));
    }

    confirmSuggestPlan = async () => {
        this.setState({
            suggestPlan: true
        });
    }
    componentDidMount = () => {
        this.getDegreeRequirements();
    }

    render(){
        let dropdown;
        var arrCourses = [];
        let tempCoursePlan = this.state.coursePlan
        let tempCourse
        Object.keys(tempCoursePlan).forEach(function (key){
            Object.keys(tempCoursePlan[key]).forEach(function (key2){
                    Object.keys(tempCoursePlan[key][key2]).forEach(function (key3){
                        arrCourses.push(tempCoursePlan[key][key2][key3])
                    }) 
            })
        });
        console.log(arrCourses);
        if (this.state.major.replace(/ /g,'') == "AMS" && this.state.rerender) {
            if(this.state.track == "Computational Applied Mathematics"){
                dropdown = <div>
                    <Collapsible class="disabled">
                        {this.state.degreeData.requirements.tracks.comp.courses.map((course) => (
                            <CollapsibleItem icon={<Checkbox indeterminate disabled id={course}/>} header={course}></CollapsibleItem>
                        ))}
                        <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.final_recommendation.name}></CollapsibleItem>
                    </Collapsible>
                </div>;
            }
            else if(this.state.track == "Operations Research"){
                dropdown = <div>
                <Collapsible class="disabled">
                    {this.state.degreeData.requirements.tracks.op.courses.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.final_recommendation.name}></CollapsibleItem>
                </Collapsible>
                </div>;
            }
            else if(this.state.track == "Computational Biology"){
                dropdown = <div>
                <Collapsible class="disabled">
                    {this.state.degreeData.requirements.tracks.bio.courses.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.final_recommendation.name}></CollapsibleItem>
                </Collapsible>
                </div>;
            }
            else if(this.state.track == "Statistics"){
                dropdown = <div>
                <Collapsible class="disabled">
                    {this.state.degreeData.requirements.tracks.stats.courses.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.final_recommendation.name}></CollapsibleItem>
                </Collapsible>
                </div>;
            }
            else if(this.state.track == "Quanitative Finance"){
                dropdown = <div>
                <Collapsible class="disabled">
                    {this.state.degreeData.requirements.tracks.quan.courses.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.final_recommendation.name}></CollapsibleItem>
                </Collapsible>
                </div>;
            }
        }
        else if (this.state.major.replace(/ /g,'') == "BMI" && this.state.rerender){
            if(this.state.track = "Project/Imaging Informatics"){
                dropdown = <div>
                <Collapsible class="disabled">
                    {this.state.degreeData.requirements.seminar.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.general.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.project.imaging.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.project.elective.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                </Collapsible>
                </div>;
            }
            else if(this.state.track == "Project/Clinical Informatics"){
                dropdown = <div>
                <Collapsible class="disabled">
                    {this.state.degreeData.requirements.seminar.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.general.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.project.clinical.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.project.elective.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                </Collapsible>
                </div>;
            }
            else if(this.state.track == "Project/Translational Bio-Informatics"){
                dropdown = <div>
                <Collapsible class="disabled">
                    {this.state.degreeData.requirements.seminar.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.general.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.project.translational.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.project.elective.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                </Collapsible>
                </div>;
            }
            else if(this.state.track == "Thesis/Clinical Informatics"){
                dropdown = <div>
                <Collapsible class="disabled">
                    {this.state.degreeData.requirements.seminar.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.general.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.thesis.clinical.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.thesis.elective.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                </Collapsible>
                </div>;
            }
            else if(this.state.track == "Thesis/Translational Bio-Informatics"){
                dropdown = <div>
                <Collapsible class="disabled">
                    {this.state.degreeData.requirements.seminar.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.general.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.thesis.translational.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.thesis.elective.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                </Collapsible>
                </div>;
            }
            else if(this.state.track = "Thesis/Imaging Informatics"){
                dropdown = <div>
                <Collapsible class="disabled">
                    {this.state.degreeData.requirements.seminar.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.general.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.thesis.imaging.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.thesis.elective.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                </Collapsible>
                </div>;
            }
        }
        else if(this.state.major.replace(/ /g,'') == "CSE" && this.state.rerender){
            if(this.state.track == "Basic Project"){
                dropdown = <div>
                <Collapsible class="disabled">
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.registration}></CollapsibleItem>
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.credit}></CollapsibleItem>
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.gpa}></CollapsibleItem>
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.breadth.description}></CollapsibleItem>
                    {this.state.degreeData.requirements.breadth.theory.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.breadth.systems.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.breadth.information.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.course.basic.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                </Collapsible>
                </div>;
            }
            else if(this.state.track == "Advanced Project"){
                dropdown = <div>
                <Collapsible class="disabled">
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.registration}></CollapsibleItem>
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.credit}></CollapsibleItem>
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.gpa}></CollapsibleItem>
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.breadth.description}></CollapsibleItem>
                    {this.state.degreeData.requirements.breadth.theory.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.breadth.systems.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.breadth.information.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.course.advanced.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                </Collapsible>
                </div>;
            }
            else if(this.state.track == "Thesis"){
                dropdown = <div>
                <Collapsible class="disabled">
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.registration}></CollapsibleItem>
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.credit}></CollapsibleItem>
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.gpa}></CollapsibleItem>
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.breadth.description}></CollapsibleItem>
                    {this.state.degreeData.requirements.breadth.theory.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.breadth.systems.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.breadth.information.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.course.thesis.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                </Collapsible>
                </div>;
            }
        }
        else if(this.state.major.replace(/ /g,'') == "CE" && this.state.rerender){
            if(this.state.track == "Non-Thesis"){
                dropdown = <div>
                <Collapsible class="disabled">
                {this.state.degreeData.requirements.credit.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.no_thesis.description}></CollapsibleItem>
                    {this.state.degreeData.requirements.no_thesis.hardware.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.no_thesis.networking.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.no_thesis.cad.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.no_thesis.description_2}></CollapsibleItem>
                    {this.state.degreeData.requirements.no_thesis.theory.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.no_thesis.lecture}></CollapsibleItem>
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.no_thesis.other}></CollapsibleItem>
                </Collapsible>
                </div>;
            }
            else if(this.state.track == "Thesis"){
                dropdown = <div>
                <Collapsible class="disabled">
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.credit}></CollapsibleItem>
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.no_thesis.description}></CollapsibleItem>
                    {this.state.degreeData.requirements.no_thesis.hardware.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.no_thesis.networking.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    {this.state.degreeData.requirements.no_thesis.cad.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.no_thesis.description_2}></CollapsibleItem>
                    {this.state.degreeData.requirements.no_thesis.theory.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.no_thesis.lecture}></CollapsibleItem>
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.no_thesis.other}></CollapsibleItem>
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.no_thesis.thesis}></CollapsibleItem>
                </Collapsible>
                </div>;
            }
        }
        return(
            this.state.suggestPlan ? <Redirect to={{pathname: "suggest_course_plan_gpd", state: {currentEditStudent: this.state.currentStudent}}}></Redirect> :
            <div align="left">
                <Navbar className="blue"></Navbar>
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
                                    <TextInput class="white" onChange={this.onChange} value={this.state.sbuID} id="sbuID">
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
                                    <Button onClick={this.onDeleteComment}>Delete Comment</Button>
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
                <Link to="/manage_students_gpd">
                    <Button>Return Home</Button>
                </Link>
            </div>
            
        );
    }
}
export default EditStudentGPD;