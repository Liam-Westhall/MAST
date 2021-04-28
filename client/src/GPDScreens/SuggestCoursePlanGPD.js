import React, { Component} from 'react'
import { Button, Row, Col, Table, Checkbox, Card, TimePicker } from 'react-materialize';
import NavbarGPD from './NavbarGPD'
import Select from 'react-select'

class SuggestCoursePlanGPD extends Component {
    constructor(props){
        super(props)
        this.state = {

        };
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
                                <input type="number" id="credits" name="credits" step="1" min="0" max="24"></input>
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
                                        <tr>
                                            <td data-field="Name"><Checkbox label={<span style={{color: "black"}}>Course</span>}></Checkbox></td>
                                        </tr>
                                        <tr>
                                            <td data-field="Name"><Checkbox label={<span style={{color: "black"}}>Course</span>}></Checkbox></td>
                                        </tr>
                                        <tr>
                                            <td data-field="Name"><Checkbox label={<span style={{color: "black"}}>Course</span>}></Checkbox></td>
                                        </tr>
                                        <tr>
                                            <td data-field="Name"><Checkbox label={<span style={{color: "black"}}>Course</span>}></Checkbox></td>
                                        </tr>
                                        <tr>
                                            <td data-field="Name"><Checkbox label={<span style={{color: "black"}}>Course</span>}></Checkbox></td>
                                        </tr>
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
                                        <tr>
                                            <td data-field="Name"><Checkbox label={<span style={{color: "black"}}>Course</span>}></Checkbox></td>
                                        </tr>
                                        <tr>
                                            <td data-field="Name"><Checkbox label={<span style={{color: "black"}}>Course</span>}></Checkbox></td>
                                        </tr>
                                        <tr>
                                            <td data-field="Name"><Checkbox label={<span style={{color: "black"}}>Course</span>}></Checkbox></td>
                                        </tr>
                                        <tr>
                                            <td data-field="Name"><Checkbox label={<span style={{color: "black"}}>Course</span>}></Checkbox></td>
                                        </tr>
                                        <tr>
                                            <td data-field="Name"><Checkbox label={<span style={{color: "black"}}>Course</span>}></Checkbox></td>
                                        </tr>
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
                                    <input type="time"></input>
                                </Col>
                                <Col l={3}>
                                    <b>to</b>
                                </Col>
                                <Col l={3}>
                                    <input type="time"></input>
                                </Col>
                            </Row>
                            <Row>
                                <Col l={3}>
                                    <b><u>Tuesday</u></b>
                                </Col>
                                <Col l={3}>
                                    <input type="time"></input>
                                </Col>
                                <Col l={3}>
                                    <b>to</b>
                                </Col>
                                <Col l={3}>
                                    <input type="time"></input>
                                </Col>
                            </Row>
                            <Row>
                                <Col l={3}>
                                    <b><u>Wednesday</u></b>
                                </Col>
                                <Col l={3}>
                                    <input type="time"></input>
                                </Col>
                                <Col l={3}>
                                    <b>to</b>
                                </Col>
                                <Col l={3}>
                                    <input type="time"></input>
                                </Col>
                            </Row>
                            <Row>
                                <Col l={3}>
                                    <b><u>Thursday</u></b>
                                </Col>
                                <Col l={3}>
                                    <input type="time"></input>
                                </Col>
                                <Col l={3}>
                                    <b>to</b>
                                </Col>
                                <Col l={3}>
                                    <input type="time"></input>
                                </Col>
                            </Row>
                            <Row>
                                <Col l={3}>
                                    <b><u>Friday</u></b>
                                </Col>
                                <Col l={3}>
                                    <input type="time"></input>
                                </Col>
                                <Col l={3}>
                                    <b>to</b>
                                </Col>
                                <Col l={3}>
                                    <input type="time"></input>
                                </Col>
                            </Row>
                        </Card>
                    </Row>
                </Col>
            </Row>
            </div>
        );
    }
}

export default SuggestCoursePlanGPD;