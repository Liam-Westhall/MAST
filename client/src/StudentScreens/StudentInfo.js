import React, { Component} from 'react'
import { Card, Row, Col, Navbar, TextInput, Button, Collapsible, CollapsibleItem, Table } from 'react-materialize'
import {Link} from 'react-router-dom'
import axios from 'axios'

class StudentInfo extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentStudent: this.props.location.state.currentEditStudent,
            firstName: this.props.location.state.currentEditStudent.User.firstName,
            lastName: this.props.location.state.currentEditStudent.User.lastName,
            email: this.props.location.state.currentEditStudent.User.email,
            major: this.props.location.state.currentEditStudent.department,
            entrySemester: this.props.location.state.currentEditStudent.entrySemester,
            track: this.props.location.state.currentEditStudent.track,
            sbuID: this.props.location.state.currentEditStudent.sbuID,
            expectedGraduation: ""
        };
        console.log(this.state.currentStudent);
        }
        onChange = (event) => {
            this.setState({[event.target.id]: event.target.value});
        }
        onChangeName = (event) => {
            let nameStr = event.target.value.split(" ");
            this.setState({firstName: nameStr[0], lastName: nameStr[1]});
        }
        render(){
            return(
                <div align="left">
                    <Navbar className="blue"></Navbar>
                    <br></br>
                    <Row>
                        <Col l={6}>
                            <b>Edit Profile: {this.state.firstName + " " + this.state.lastName}</b>
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
                                        <Collapsible accordion>
                                            <CollapsibleItem>Comment</CollapsibleItem>
                                            <CollapsibleItem>Comment</CollapsibleItem>
                                            <CollapsibleItem>Comment</CollapsibleItem>
                                            <CollapsibleItem>Comment</CollapsibleItem>
                                            <CollapsibleItem>Comment</CollapsibleItem>
                                            <CollapsibleItem>Comment</CollapsibleItem>
                                        </Collapsible>
                                    </Col>
                                    <Col><TextInput placeholder="Comment..." class="white"></TextInput></Col>
                                </Row>
                                <Row>
                                    <Col l={6}>
                                        <Button>Delete Comment</Button>
                                    </Col>
                                    <Col l={6}>
                                        <Button>Add Comment</Button>
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
                                <Table className="white">
                                    <thead>
                                        <tr>
                                        <th>Course</th>
                                        <th>Status</th>
                                        <th>Grade</th>
                                        <th>Semester</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>AMS 501</td>
                                            <td>Pending</td>
                                            <td>N/A</td>
                                            <td>Spring 2018</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                            </Row>
                        </Card>
                        </Col>    
                    </Row>
                    <Link to="/student_info_stu">
                        <Button>Return Home</Button>
                    </Link>
                </div>
                
            );
        }
    }
    export default StudentInfo;