import React, { Component} from 'react'
import { Card, Row, Col, Navbar, TextInput, Button, Collapsible, CollapsibleItem, Table, Checkbox } from 'react-materialize'
import {Link} from 'react-router-dom'
import axios from 'axios'
import NavbarStudent from './NavbarStudent';

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
            comments: []
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
            let res = await axios.post("http://localhost:5000/api/comments/add_comment", body, header).then(this.setState({comments: newComments})).catch((err) => console.log(err));
        }

        findStudent = async () => {
            console.log(this.props.location.state.email);
            let body = {email: this.props.location.state.email}
            console.log(body);
            let res = await axios.post("/api/students/find_student", body);
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
                comments: people.comments
            });
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

        componentDidMount = () => {
            this.findStudent();
            this.getDegreeRequirements();
        }

        render(){
            let dropdown;
            if (this.state.major.replace(/ /g,'') == "AMS" && this.state.rerender) {
                if(this.state.track == "Computational Applied Mathematics"){
                    dropdown = <div>
                        <Collapsible class="disabled">
                            {this.state.degreeData.requirements.tracks.comp.map((course) => (
                                <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                            ))}
                            <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.final_recommendation.name}></CollapsibleItem>
                        </Collapsible>
                    </div>;
                }
                else if(this.state.track == "Operations Research"){
                    dropdown = <div>
                    <Collapsible class="disabled">
                        {this.state.degreeData.requirements.tracks.op.map((course) => (
                            <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                        ))}
                        <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.final_recommendation.name}></CollapsibleItem>
                    </Collapsible>
                    </div>;
                }
                else if(this.state.track == "Computational Biology"){
                    dropdown = <div>
                    <Collapsible class="disabled">
                        {this.state.degreeData.requirements.tracks.bio.map((course) => (
                            <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                        ))}
                        <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.final_recommendation.name}></CollapsibleItem>
                    </Collapsible>
                    </div>;
                }
                else if(this.state.track == "Statistics"){
                    dropdown = <div>
                    <Collapsible class="disabled">
                        {this.state.degreeData.requirements.tracks.stats.map((course) => (
                            <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                        ))}
                        <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.final_recommendation.name}></CollapsibleItem>
                    </Collapsible>
                    </div>;
                }
                else if(this.state.track == "Quanitative Finance"){
                    dropdown = <div>
                    <Collapsible class="disabled">
                        {this.state.degreeData.requirements.tracks.quan.map((course) => (
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
                <div align="left">
                    <NavbarStudent></NavbarStudent>
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
                                        <TextInput class="white" onChange={this.onChange} value={this.state.sbuID} id="sbuID" disabled>
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
                                            {this.state.comments.map((comment) =>
                                            (<CollapsibleItem header={comment.message}></CollapsibleItem>))}
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
                            <Row>
                            <Col l={12}>
                                <Table className="white">
                                    <thead>
                                        <tr>
                                        <th>Course</th>
                                        <th>Credit(s)</th>
                                        <th>Time</th>
                                        <th>Professor</th>
                                        <th>Location</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>AMS 501</td>
                                            <td>3</td>
                                            <td>T/Th 4:00PM-5:20PM</td>
                                            <td>John Doe</td>
                                            <td>Javits 100</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                            </Row>
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