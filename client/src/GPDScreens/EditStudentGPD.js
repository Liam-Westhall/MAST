import React, { Component} from 'react'
import { Card, Row, Col, Navbar, TextInput, Button, Collapsible, CollapsibleItem, Table } from 'react-materialize';

class EditStudentGPD extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentStudent: null
        };
    }

    render(){
        return(
            <div align="left">
                <Navbar className="blue"></Navbar>
                <br></br>
                <Row>
                    <Col l={6}>
                        <b>Edit Student: John Doe</b>
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
                                    <TextInput class="white">
                                    </TextInput>
                                </Col>
                                <Col l={6}>
                                    <TextInput class="white">
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
                                    <TextInput class="white">
                                    </TextInput>
                                </Col>
                                <Col l={6}>
                                    <TextInput class="white">
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
                                    <TextInput class="white">
                                    </TextInput>
                                </Col>
                                <Col l={6}>
                                    <TextInput class="white darken-3">
                                    </TextInput>
                                </Col>
                            </Row>
                            <Row>
                                <Col offset="l6" l={6}>
                                    <span class="white-text">Track:</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col l={6}>
                                    <Button>Confirm Changes</Button>
                                </Col>
                                <Col l={6}>
                                    <TextInput class="white darken-3">
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
            </div>
            
        );
    }
}
export default EditStudentGPD;