import React, { Component} from 'react'
import axios from axios
import NavbarGPD from './NavbarGPD'
import {Navbar, Row, Column, Col, TextInput, Button, Table} from 'react-materialize'
class ManageStudentsGPD extends Component{

    constructor(props){
        super(props)
        this.state = { 
            students: []
        }
    }

    componentDidMount = async () => {
        var students = await axios.get('/api/students')
        this.setState({students})
    }

    render(){
        return(
            <div>
                <NavbarGPD />
                <div className="body">
                <Row>
                    <Col
                    offset="l10"
                    l={3}>
                        <TextInput
                        icon="search"
                        label="Search">
                        </TextInput>
                    </Col>
                </Row>
                <Row>
                    <Col
                    offset="l10"
                    l={2}>
                        <Button node="button" waves="light">
                            Advanced Search
                        </Button>
                    </Col>
                </Row>
                <Table>
                    <thead>
                        <tbody>
                            {this.state.students.length <= 0 ? <h1>No Students Found</h1> : this.state.students.map((student) => {
                                <tr>
                                    <th data-field="Name">{student.User.firsname + " " + student.User.lastName}</th>
                                    <th data-field="Id">{student.sbuID}</th>
                                    <th data-field="Email">{student.User.email}</th>
                                    <th data-field="Department">{student.department}</th>
                                    <th data-field="Track">{student.track}</th>
                                    <th data-field="Entry Semester">{student.entrySemester}</th>
                                </tr>
                            })}
                        </tbody>
                    </thead>
                </Table>
                <br></br>
                <Row>
                    <Col
                    offset="l9"
                    size={1}>
                        <Button>Add Student</Button>
                    </Col>
                    <Col
                    size={1}>
                        <Button>Edit Info</Button>
                    </Col>
                    <Col
                    size={1}>
                        <Button>Delete</Button>
                    </Col>
                </Row>
                </div>
            </div>
            
        )
    }
}

export default ManageStudentsGPD